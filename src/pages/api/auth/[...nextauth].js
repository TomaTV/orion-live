import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
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
      },
      async authorize(credentials, req) {
        try {
          const userAgent = req.headers["user-agent"] || "unknown";
          const clientIp =
            req.headers["x-forwarded-for"] ||
            req.socket?.remoteAddress ||
            "::ffff:127.0.0.1";

          // Appeler votre API de login
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

          if (!res.ok || !data.id) {
            throw new Error(data.message || "Authentication failed");
          }

          // Générer un token de session
          const sessionToken = crypto.randomBytes(64).toString("hex");
          const deviceId = crypto
            .createHash("sha256")
            .update(userAgent)
            .digest("hex");

          // Insérer la session dans la base SQL
          await pool.query(
            `INSERT INTO sessions (
              user_id,
              token,
              device_id,
              expires_at,
              ip_address,
              user_agent
            ) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), ?, ?)`,
            [
              data.id, // L'ID de l'utilisateur retourné par votre API
              sessionToken,
              deviceId,
              clientIp,
              userAgent,
            ]
          );

          // Retourner les données utilisateur requises pour NextAuth
          return { id: data.id, email: data.email, name: data.name };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Email ou mot de passe invalide");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account.provider === "google") {
          // Récupérer les infos de connexion stockées
          const [loginInfo] = await pool.query(
            `SELECT * FROM login_info_temp 
             WHERE used = 0 
             ORDER BY created_at DESC 
             LIMIT 1`
          );

          let clientIp = "::ffff:127.0.0.1";
          let userAgent = "unknown";
          let deviceId = crypto
            .createHash("sha256")
            .update("unknown")
            .digest("hex");

          if (loginInfo[0]) {
            clientIp = loginInfo[0].ip_address;
            userAgent = loginInfo[0].user_agent;
            deviceId = loginInfo[0].device_id;

            // Marquer l'info comme utilisée
            await pool.query(
              "UPDATE login_info_temp SET used = 1 WHERE id = ?",
              [loginInfo[0].id]
            );
          }

          await pool.query("START TRANSACTION");

          try {
            // Vérifier si l'utilisateur existe
            const [users] = await pool.query(
              "SELECT * FROM users WHERE email = ? OR google_id = ?",
              [profile.email, profile.sub]
            );

            let userId;

            if (users.length === 0) {
              // Créer un nouvel utilisateur
              const [result] = await pool.query(
                `INSERT INTO users (
                  email, 
                  google_id, 
                  credits,
                  rank,
                  created_at,
                  last_login,
                  created_ip,
                  created_user_agent,
                  last_ip,
                  last_user_agent
                ) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?)`,
                [
                  profile.email,
                  profile.sub,
                  1, // Crédits initiaux
                  "free",
                  clientIp,
                  userAgent,
                  clientIp,
                  userAgent,
                ]
              );

              userId = result.insertId;

              // Créer le profil
              await pool.query(
                `INSERT INTO profiles (
                  user_id,
                  first_name,
                  last_name,
                  avatar_url
                ) VALUES (?, ?, ?, ?)`,
                [
                  userId,
                  profile.given_name || null,
                  profile.family_name || null,
                  profile.picture || null,
                ]
              );

              // Créer device et paramètres
              await pool.query(
                `INSERT INTO user_devices (
                  user_id,
                  device_id,
                  user_agent,
                  last_ip,
                  is_trusted
                ) VALUES (?, ?, ?, ?, ?)`,
                [userId, deviceId, userAgent, clientIp, true]
              );

              await pool.query(
                "INSERT INTO user_settings (user_id) VALUES (?)",
                [userId]
              );

              // Log de l'inscription
              await pool.query(
                `INSERT INTO security_logs (
                  type,
                  email,
                  ip_address,
                  user_agent,
                  status,
                  error
                ) VALUES (?, ?, ?, ?, 'SUCCESS', ?)`,
                [
                  "GOOGLE_REGISTER",
                  profile.email,
                  clientIp,
                  userAgent,
                  JSON.stringify({ deviceId }),
                ]
              );
            } else {
              userId = users[0].id;

              // Mettre à jour l'utilisateur existant
              await pool.query(
                `UPDATE users SET 
                  last_login = NOW(),
                  last_ip = ?,
                  last_user_agent = ?
                WHERE id = ?`,
                [clientIp, userAgent, userId]
              );

              // Vérifier si le device existe
              const [devices] = await pool.query(
                "SELECT id FROM user_devices WHERE user_id = ? AND device_id = ?",
                [userId, deviceId]
              );

              if (devices.length === 0) {
                // Ajouter le nouvel appareil
                await pool.query(
                  `INSERT INTO user_devices (
                    user_id,
                    device_id,
                    user_agent,
                    last_ip,
                    is_trusted,
                    login_count
                  ) VALUES (?, ?, ?, ?, ?, ?)`,
                  [userId, deviceId, userAgent, clientIp, false, 1]
                );

                // Vérifier si on a déjà envoyé un email pour ce device
                const [emailLogs] = await pool.query(
                  `SELECT * FROM security_email_logs 
                   WHERE user_id = ? AND device_id = ? AND email_type = 'new_device'`,
                  [userId, deviceId]
                );

                if (emailLogs.length === 0) {
                  // Envoyer l'email de nouveau device
                  await pool.query(
                    `INSERT INTO security_email_logs (user_id, device_id, email_type)
                     VALUES (?, ?, 'new_device')`,
                    [userId, deviceId]
                  );
                  // Logique d'envoi d'email ici
                }
              } else {
                // Mettre à jour le compteur de connexions
                await pool.query(
                  `UPDATE user_devices 
                   SET login_count = CASE
                         WHEN login_count + 1 >= 5 AND is_trusted = 0 THEN 0
                         ELSE login_count + 1
                       END,
                       is_trusted = CASE
                         WHEN login_count + 1 >= 5 THEN 1
                         ELSE is_trusted
                       END,
                       last_verified_at = NOW()
                   WHERE user_id = ? AND device_id = ?`,
                  [userId, deviceId]
                );

                // Vérifier si le device vient d'être trusted
                const [updatedDevice] = await pool.query(
                  `SELECT login_count, is_trusted FROM user_devices
                   WHERE user_id = ? AND device_id = ?`,
                  [userId, deviceId]
                );

                if (updatedDevice[0]?.is_trusted === 1) {
                  // Log du changement de statut
                  await pool.query(
                    `INSERT INTO security_logs (type, email, ip_address, user_agent, status, error)
                     VALUES (?, ?, ?, ?, 'SUCCESS', ?)`,
                    [
                      "DEVICE_TRUSTED",
                      profile.email,
                      clientIp,
                      userAgent,
                      JSON.stringify({ deviceId }),
                    ]
                  );
                }
              }

              // Log de la connexion
              await pool.query(
                `INSERT INTO security_logs (
                  type,
                  email,
                  ip_address,
                  user_agent,
                  status,
                  error
                ) VALUES (?, ?, ?, ?, 'SUCCESS', ?)`,
                [
                  "GOOGLE_LOGIN",
                  profile.email,
                  clientIp,
                  userAgent,
                  JSON.stringify({ deviceId }),
                ]
              );
            }

            // Créer la session
            const sessionToken = crypto.randomBytes(64).toString("hex");
            await pool.query(
              `INSERT INTO sessions (
                user_id,
                token,
                device_id,
                expires_at,
                ip_address,
                user_agent
              ) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY), ?, ?)`,
              [userId, sessionToken, deviceId, clientIp, userAgent]
            );

            await pool.query("COMMIT");

            // Assigner l'ID à l'utilisateur
            user.id = userId;
            return true;
          } catch (error) {
            await pool.query("ROLLBACK");
            console.error("Erreur transaction Google:", error);
            throw error;
          }
        }

        return true;
      } catch (error) {
        console.error("Erreur signin:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }

      if (session?.user?.email) {
        try {
          const [users] = await pool.query(
            "SELECT id, email, credits, rank FROM users WHERE email = ?",
            [session.user.email]
          );

          if (users[0]) {
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
  debug: false,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
