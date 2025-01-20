import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import pool from "../../../lib/db";

async function createSession(userId, ip, userAgent, token) {
  const deviceId = crypto.createHash("sha256").update(userAgent).digest("hex");
  console.log("Creating session with:", { userId, ip, userAgent, deviceId });

  await pool.query(
    "DELETE FROM sessions WHERE user_id = ? OR expires_at < NOW()",
    [userId]
  );

  await pool.query(
    `INSERT INTO sessions (user_id, token, device_id, expires_at, ip_address, user_agent) 
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), ?, ?)`,
    [userId, token, deviceId, ip, userAgent]
  );
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const userAgent = req.headers["user-agent"] || "unknown";
          console.log("Real user agent:", userAgent);

          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-User-Agent": userAgent,
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            if (res.status === 429 || res.status === 403) {
              throw new Error(data.message);
            }
            throw new Error(data.message || "Une erreur est survenue");
          }

          return {
            ...data.user,
            userAgent,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials, req }) {
      try {
        if (account.provider === "credentials") {
          const clientIp =
            req?.headers["x-forwarded-for"] ||
            req?.socket?.remoteAddress ||
            "::ffff:127.0.0.1";

          await createSession(
            user.id,
            clientIp,
            user.userAgent,
            crypto.randomBytes(64).toString("hex")
          );
          return true;
        }

        // Pour Google Login
        const [preLogs] = await pool.query(
          `SELECT ip_address, user_agent
           FROM security_logs 
           WHERE type = 'PRE_GOOGLE_LOGIN' 
           AND status = 'PENDING'
           ORDER BY created_at DESC 
           LIMIT 1`
        );

        const clientIp = preLogs[0]?.ip_address || "::ffff:127.0.0.1";
        const userAgent =
          preLogs[0]?.user_agent || req?.headers["user-agent"] || "unknown";

        // Vérifier si l'utilisateur existe déjà
        const [users] = await pool.query(
          "SELECT * FROM users WHERE email = ? OR google_id = ?",
          [user.email, profile.sub]
        );

        const logType = users.length === 0 ? "GOOGLE_REGISTER" : "GOOGLE_LOGIN";

        // Mise à jour du log précédent
        if (preLogs[0]) {
          await pool.query(
            `UPDATE security_logs 
             SET status = 'SUCCESS', 
                 email = ?,
                 type = ?
             WHERE type = 'PRE_GOOGLE_LOGIN' 
             AND status = 'PENDING'
             ORDER BY created_at DESC 
             LIMIT 1`,
            [user.email, logType]
          );
        }

        let userId;

        if (users.length === 0) {
          // Nouveau utilisateur
          const [result] = await pool.query(
            `INSERT INTO users (
              email, google_id, credits, rank,
              created_at, last_login,
              created_ip, created_user_agent,
              last_ip, last_user_agent
            ) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)`,
            [
              user.email,
              profile.sub,
              1,
              "free",
              clientIp,
              userAgent,
              clientIp,
              userAgent,
            ]
          );

          userId = result.insertId;

          await pool.query(
            `INSERT INTO profiles (
              user_id, first_name, last_name, avatar_url
            ) VALUES (?, ?, ?, ?)`,
            [
              userId,
              profile.given_name || "",
              profile.family_name || "",
              profile.picture || "",
            ]
          );

          await pool.query("INSERT INTO user_settings (user_id) VALUES (?)", [
            userId,
          ]);
        } else {
          userId = users[0].id;

          await pool.query(
            `UPDATE users SET 
              google_id = ?,
              last_login = NOW(),
              last_ip = ?,
              last_user_agent = ?
            WHERE email = ?`,
            [profile.sub, clientIp, userAgent, user.email]
          );
        }

        const sessionToken = crypto.randomBytes(64).toString("hex");
        await createSession(userId, clientIp, userAgent, sessionToken);

        user.id = userId;
        user.sessionToken = sessionToken;
        user.userAgent = userAgent;

        return true;
      } catch (error) {
        console.error("Erreur signin:", error);
        return false;
      }
    },

    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;
        token.sessionToken = user.sessionToken;
        token.userAgent = user.userAgent;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.userAgent = token.userAgent;
      }

      if (session?.user?.email) {
        try {
          const [users] = await pool.query(
            "SELECT id, email, credits, rank FROM users WHERE email = ?",
            [session.user.email]
          );

          if (users.length > 0) {
            session.user.credits = users[0].credits;
            session.user.rank = users[0].rank;
          }
        } catch (error) {
          console.error("Erreur session:", error);
        }
      }
      return session;
    },

    async signOut({ session, token }) {
      try {
        const email = session?.user?.email || token?.email;
        if (!email) {
          console.error("Pas d'email trouvé dans session ou token");
          return false;
        }

        // Récupérer les infos de l'utilisateur avec logging
        const [users] = await pool.query(
          `SELECT id, email, last_ip, last_user_agent, google_id 
           FROM users 
           WHERE email = ? 
           AND deleted_at IS NULL`,
          [email]
        );

        if (users[0]) {
          const user = users[0];
          const logType = user.google_id ? "GOOGLE_LOGOUT" : "LOGOUT";

          // Log de déconnexion
          await pool.query(
            `INSERT INTO security_logs 
             (type, email, ip_address, user_agent, status, error)
             VALUES (?, ?, ?, ?, 'SUCCESS', ?)`,
            [
              logType,
              user.email,
              user.last_ip,
              user.last_user_agent,
              JSON.stringify({
                provider: user.google_id ? "google" : "credentials",
              }),
            ]
          );

          // Suppression des sessions au logout
          await pool.query("DELETE FROM sessions WHERE user_id = ?", [user.id]);

          return true;
        } else {
          console.error("Utilisateur non trouvé pour email:", email);
          return false;
        }
      } catch (error) {
        console.error("Erreur lors du logout:", error);
        return false;
      }
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`Signin event - User Agent: ${user.userAgent}`);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
