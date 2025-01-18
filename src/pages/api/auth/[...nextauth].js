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
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "credentials") {
        return true;
      }

      try {
        // Vérifier/créer le compte Google
        const [users] = await pool.query(
          "SELECT * FROM users WHERE email = ? OR google_id = ?",
          [user.email, profile.sub]
        );

        const now = new Date();
        const ipAddress =
          typeof window !== "undefined"
            ? window.localStorage.getItem("userIp") || "unknown"
            : "unknown";

        if (users.length === 0) {
          // Créer un nouvel utilisateur
          const [result] = await pool.query(
            `INSERT INTO users (
              email,
              password,
              google_id,
              credits,
              rank,
              created_at,
              last_login,
              created_ip,
              created_user_agent,
              last_ip,
              last_user_agent,
              failed_attempts,
              lock_until,
              updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user.email, // email
              null, // password
              profile.sub, // google_id
              1, // credits
              "free", // rank
              now, // created_at
              now, // last_login
              ipAddress, // created_ip
              profile.userAgent || navigator?.userAgent || "unknown", // created_user_agent
              ipAddress, // last_ip
              profile.userAgent || navigator?.userAgent || "unknown", // last_user_agent
              0, // failed_attempts
              null, // lock_until
              now, // updated_at
            ]
          );

          // Créer le profil
          await pool.query(
            `INSERT INTO profiles (
              user_id,
              first_name,
              last_name,
              avatar_url,
              created_at
            ) VALUES (?, ?, ?, ?, ?)`,
            [
              result.insertId,
              profile.given_name || "",
              profile.family_name || "",
              profile.picture || "",
              now,
            ]
          );

          // Créer les settings par défaut
          await pool.query("INSERT INTO user_settings (user_id) VALUES (?)", [
            result.insertId,
          ]);
        } else {
          // Mettre à jour les informations existantes
          await pool.query(
            `UPDATE users SET 
              google_id = ?,
              last_login = ?,
              updated_at = ?,
              last_ip = ?,
              last_user_agent = ?
            WHERE email = ?`,
            [
              profile.sub,
              now,
              now,
              ipAddress,
              profile.userAgent || navigator?.userAgent || "unknown",
              user.email,
            ]
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
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
