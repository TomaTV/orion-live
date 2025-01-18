import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../../lib/db";

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
        userAgent: { type: "text" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-User-Agent": credentials.userAgent,
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

          return data.user; // Retourner directement l'utilisateur
        } catch (error) {
          throw error; // Propager l'erreur pour qu'elle soit affichée
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account.provider === "credentials") {
          return true;
        }

        // Récupérer les infos stockées précédemment
        const [lastLogs] = await pool.query(
          `SELECT ip_address, user_agent
           FROM security_logs 
           WHERE type = 'PRE_GOOGLE_LOGIN' 
           AND status = 'PENDING'
           ORDER BY created_at DESC 
           LIMIT 1`
        );

        const clientIp = lastLogs[0]?.ip_address;
        const userAgent = lastLogs[0]?.user_agent;

        // Vérifier si l'utilisateur existe déjà
        const [users] = await pool.query(
          "SELECT * FROM users WHERE email = ? OR google_id = ?",
          [user.email, profile.sub]
        );

        // Définir le type de log en fonction de si c'est une première connexion ou non
        const logType =
          users.length === 0
            ? "REGISTER_GOOGLE_ATTEMPT"
            : "LOGIN_GOOGLE_ATTEMPT";

        // Mise à jour du log précédent
        if (lastLogs[0]) {
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

          await pool.query(
            `INSERT INTO profiles (
              user_id, first_name, last_name, avatar_url
            ) VALUES (?, ?, ?, ?)`,
            [
              result.insertId,
              profile.given_name || "",
              profile.family_name || "",
              profile.picture || "",
            ]
          );

          await pool.query("INSERT INTO user_settings (user_id) VALUES (?)", [
            result.insertId,
          ]);
        } else {
          // Mise à jour utilisateur existant
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
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const [users] = await pool.query(
            "SELECT id, email, credits, rank FROM users WHERE email = ?",
            [session.user.email]
          );

          if (users.length > 0) {
            session.user.id = users[0].id;
            session.user.credits = users[0].credits;
            session.user.rank = users[0].rank;
          }
        } catch (error) {
          console.error("Erreur session:", error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
