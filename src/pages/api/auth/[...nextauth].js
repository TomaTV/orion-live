import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from 'crypto';
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
          // Récupérer le dernier user-agent connu
          const [lastLogs] = await pool.query(
            `SELECT user_agent FROM security_logs 
             WHERE email = ? 
             AND status = 'SUCCESS' 
             ORDER BY created_at DESC 
             LIMIT 1`,
            [credentials.email]
          );

          const userAgent = lastLogs[0]?.user_agent || credentials.userAgent;

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

          return data.user;
        } catch (error) {
          throw error;
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

        const clientIp = lastLogs[0]?.ip_address || '127.0.0.1';
        const userAgent = lastLogs[0]?.user_agent;

        // Vérifier si l'utilisateur existe déjà
        const [users] = await pool.query(
          "SELECT * FROM users WHERE email = ? OR google_id = ?",
          [user.email, profile.sub]
        );

        // Définir le type de log en fonction de si c'est une première connexion ou non
        const logType = users.length === 0 ? "GOOGLE_REGISTER" : "GOOGLE_LOGIN";

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

          await pool.query(
            "INSERT INTO user_settings (user_id) VALUES (?)",
            [userId]
          );
        } else {
          userId = users[0].id;
          
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

        // Création de session
        const sessionToken = crypto.randomBytes(32).toString('hex');

        await pool.query(
          `INSERT INTO sessions (
            user_id, token, expires_at, ip_address, user_agent
          ) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), ?, ?)`,
          [userId, sessionToken, clientIp, userAgent]
        );

        user.id = userId;
        user.sessionToken = sessionToken;

        return true;
      } catch (error) {
        console.error("Erreur signin:", error);
        return false;
      }
    },

    async jwt({ token, account, profile, user }) {
      // Log pour déboguer le flux JWT
      console.log('jwt callback avec:', { tokenEmail: token?.email, userEmail: user?.email });
      
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email; // Ajout de l'email dans le token
        token.sessionToken = user.sessionToken;
      }
      return token;
    },

    async session({ session, token }) {
      // Log pour déboguer le flux de session
      console.log('session callback avec:', { sessionEmail: session?.user?.email, tokenEmail: token?.email });

      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
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
      console.log('signOut callback appelé avec:', { session, token });
      try {
        const email = session?.user?.email || token?.email;
        console.log('Email trouvé:', email);
        if (!email) {
          console.error('Pas d\'email trouvé dans session ou token');
          return false;
        }

        // Récupérer les infos de l'utilisateur avec logging
        console.log('Recherche utilisateur pour email:', email);
        const [users] = await pool.query(
          `SELECT id, email, last_ip, last_user_agent, google_id 
           FROM users 
           WHERE email = ? 
           AND deleted_at IS NULL`,
          [email]
        );
        console.log('Utilisateur trouvé:', users[0]);

        if (users[0]) {
          const user = users[0];
          const logType = user.google_id ? 'GOOGLE_LOGOUT' : 'LOGOUT';
          console.log('Type de logout:', logType);
          
          // Log de déconnexion
          await pool.query(
            `INSERT INTO security_logs 
             (type, email, ip_address, user_agent, status, error)
             VALUES (?, ?, ?, ?, 'SUCCESS', ?)`,
            [logType, user.email, user.last_ip, user.last_user_agent, 
             JSON.stringify({ provider: user.google_id ? 'google' : 'credentials' })]
          );
          console.log('Log de sécurité créé');

          // Suppression de toutes les sessions de l'utilisateur
          const [result] = await pool.query(
            'DELETE FROM sessions WHERE user_id = ?',
            [user.id]
          );
          console.log('Sessions supprimées:', result.affectedRows);

          return true;
        } else {
          console.error('Utilisateur non trouvé pour email:', email);
          return false;
        }
      } catch (error) {
        console.error('Erreur lors du logout:', error);
        return false;
      }
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);