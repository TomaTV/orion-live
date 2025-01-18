import bcrypt from "bcryptjs";
import pool from "../../../lib/db";
import crypto from "crypto";
import { rateLimit } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/validation";

// Configuration du rate limiter
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Récupération de l'IP et user agent
  const clientIp =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";
  const userAgent =
    req.headers["x-user-agent"] || req.headers["user-agent"] || "unknown";

  try {
    // Vérification du rate limit
    try {
      await limiter.check(clientIp);
    } catch (error) {
      return res.status(429).json({
        message:
          "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
      });
    }

    const { email, password, rememberMe = false } = req.body;

    // Validation améliorée de l'email
    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis.",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Format d'email invalide.",
      });
    }

    // Création du log de sécurité
    const [insertLog] = await pool.query(
      `INSERT INTO security_logs (type, email, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?)`,
      ["LOGIN_ATTEMPT", email, clientIp, userAgent, "PENDING"]
    );
    const logId = insertLog.insertId;

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );

    const user = users[0];

    if (users[0]?.google_id) {
      return res.status(400).json({
        message:
          "Ce compte utilise Google. Veuillez vous connecter avec Google.",
      });
    }

    if (!user) {
      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
        "FAILED_NOT_FOUND",
        logId,
      ]);
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérification si c'est un compte Google
    if (user.google_id) {
      await pool.query(
        "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
        ["FAILED_GOOGLE_ACCOUNT", email, "LOGIN_ATTEMPT"]
      );
      return res.status(400).json({
        message:
          "Ce compte utilise la connexion Google. Veuillez vous connecter avec Google.",
        isGoogleAccount: true,
      });
    }

    // Vérification du verrouillage
    const now = new Date();
    if (user.lock_until && new Date(user.lock_until) > now) {
      const lockTime = Math.ceil((new Date(user.lock_until) - now) / 1000 / 60);
      await pool.query(
        "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
        ["FAILED_LOCKED", email, "LOGIN_ATTEMPT"]
      );
      return res.status(403).json({
        message: `Compte temporairement verrouillé. Réessayez dans ${lockTime} minutes.`,
      });
    }

    // Vérification du mot de passe
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      // Transaction pour la gestion des tentatives
      await pool.query("START TRANSACTION");

      try {
        // Récupérer le nombre actuel de tentatives avec verrou
        const [currentUser] = await pool.query(
          "SELECT failed_attempts, lock_until FROM users WHERE email = ? FOR UPDATE",
          [email]
        );

        const newFailedAttempts = (currentUser[0]?.failed_attempts || 0) + 1;

        // Mise à jour des tentatives
        await pool.query(
          "UPDATE users SET failed_attempts = ? WHERE email = ?",
          [newFailedAttempts, email]
        );

        // Si 5 tentatives atteintes, verrouiller le compte
        if (newFailedAttempts >= 5) {
          // Verrouiller le compte
          await pool.query(
            "UPDATE users SET lock_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE email = ?",
            [email]
          );

          // Créer un nouveau log pour le blocage du compte
          const [blockLog] = await pool.query(
            `INSERT INTO security_logs (type, email, ip_address, user_agent, status)
             VALUES (?, ?, ?, ?, ?)`,
            ["BLOCK_ACCOUNT", email, clientIp, userAgent, "SUCCESS"]
          );

          await pool.query("COMMIT");

          // Mettre à jour le log de tentative de connexion
          await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
            "FAILED_MAX_ATTEMPTS",
            logId,
          ]);

          return res.status(403).json({
            message:
              "Compte bloqué pendant 30 minutes suite à trop de tentatives échouées.",
            locked: true,
            lockDuration: 30,
          });
        }

        await pool.query("COMMIT");

        // Mettre à jour le log de tentative
        await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
          "FAILED_INVALID_PASSWORD",
          logId,
        ]);

        // Message spécifique pour la dernière tentative
        if (newFailedAttempts === 4) {
          return res.status(401).json({
            message: "ATTENTION : Dernière tentative avant blocage du compte !",
            attemptsLeft: 1,
          });
        }

        return res.status(401).json({
          message: `Email ou mot de passe incorrect. Il vous reste ${5 - newFailedAttempts} tentatives.`,
          attemptsLeft: 5 - newFailedAttempts,
        });
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }
    }

    // Génération du token de session
    const token = crypto.randomBytes(64).toString("hex");
    const sessionDuration = rememberMe ? 30 : 7; // 30 jours ou 7 jours

    // Nettoyage des anciennes sessions
    await pool.query(
      "DELETE FROM sessions WHERE user_id = ? OR expires_at < NOW()",
      [user.id]
    );

    // Création de la nouvelle session
    try {
      await pool.query(
        `INSERT INTO sessions (user_id, token, expires_at, ip_address, user_agent) 
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), ?, ?)`,
        [user.id, token, sessionDuration, clientIp, req.headers["user-agent"]]
      );
    } catch (error) {
      console.error("Erreur lors de l'insertion de la session:", error);
      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
        "FAILED_SESSION_CREATE",
        logId,
      ]);
      return res.status(500).json({
        message: "Erreur lors de la création de la session",
      });
    }

    // Mise à jour des informations utilisateur
    await pool.query(
      `UPDATE users 
       SET failed_attempts = 0, 
           lock_until = NULL, 
           last_login = NOW(),
           last_ip = ?,
           last_user_agent = ?
       WHERE email = ?`,
      [clientIp, userAgent, email]
    );

    // Configuration du cookie
    const maxAge = sessionDuration * 24 * 60 * 60;
    res.setHeader(
      "Set-Cookie",
      `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
    );

    // Log du succès de la connexion
    await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
      "SUCCESS",
      logId,
    ]);

    // Mise à jour du log en succès AVANT de renvoyer la réponse
    await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
      "SUCCESS",
      logId,
    ]);

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        email: user.email,
        last_login: new Date(),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    // Si on a un logId, on l'utilise pour mettre à jour le log
    if (logId) {
      await pool.query(
        "UPDATE security_logs SET status = ?, error = ? WHERE id = ?",
        ["FAILED_SERVER_ERROR", error.message, logId]
      );
    }
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
}
