import bcrypt from "bcryptjs";
import pool from "../../../lib/db";
import crypto from "crypto";
import { rateLimit } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/validation";
import { SecurityMonitoring } from '@/lib/securityMonitoring';

// Configuration du rate limiter
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

export default async function handler(req, res) {
  let logId;

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Récupération de l'IP et user agent
    let clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";
    
    // Standardisation de l'IP au format IPv6
    if (clientIp === "127.0.0.1" || clientIp === "::1") {
      clientIp = "::ffff:127.0.0.1";
    }

    const userAgent = req.headers["x-user-agent"] || req.headers["user-agent"] || "unknown";
    const deviceId = crypto.createHash('sha256').update(userAgent).digest('hex');

    try {
      await limiter.check(clientIp);
    } catch (error) {
      return res.status(429).json({
        message: "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
      });
    }

    const { email, password } = req.body;

    if (!email || !password || !validateEmail(email)) {
      return res.status(400).json({
        message: !email || !password ? "Email et mot de passe requis." : "Format d'email invalide."
      });
    }

    // Log initial de tentative de connexion
    const [insertLog] = await pool.query(
      `INSERT INTO security_logs (type, email, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?)`,
      ["LOGIN_ATTEMPT", email, clientIp, userAgent, "PENDING"]
    );
    logId = insertLog.insertId;

    // Récupération de l'utilisateur
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );
    const user = users[0];

    if (!user) {
      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", ["FAILED_NOT_FOUND", logId]);
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérification du compte Google
    if (user.google_id) {
      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", ["FAILED_GOOGLE_ACCOUNT", logId]);
      return res.status(400).json({
        message: "Ce compte utilise la connexion Google. Veuillez vous connecter avec Google.",
        isGoogleAccount: true
      });
    }

    // Vérification du verrouillage
    const now = new Date();
    if (user.lock_until && new Date(user.lock_until) > now) {
      const lockTime = Math.ceil((new Date(user.lock_until) - now) / 1000 / 60);
      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", ["FAILED_LOCKED", logId]);
      return res.status(403).json({
        message: `Compte temporairement verrouillé. Réessayez dans ${lockTime} minutes.`
      });
    }

    // Vérification du mot de passe
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      await pool.query("START TRANSACTION");
      try {
        // Gestion des tentatives échouées
        const [currentUser] = await pool.query(
          "SELECT failed_attempts FROM users WHERE email = ? FOR UPDATE",
          [email]
        );
        const newFailedAttempts = (currentUser[0]?.failed_attempts || 0) + 1;
        await pool.query(
          "UPDATE users SET failed_attempts = ? WHERE email = ?",
          [newFailedAttempts, email]
        );

        if (newFailedAttempts >= 5) {
          await pool.query(
            "UPDATE users SET lock_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE email = ?",
            [email]
          );
          await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", ["FAILED_MAX_ATTEMPTS", logId]);
          await pool.query("COMMIT");
          return res.status(403).json({
            message: "Compte bloqué pendant 30 minutes suite à trop de tentatives échouées.",
            locked: true,
            lockDuration: 30
          });
        }

        await pool.query("COMMIT");
        await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", ["FAILED_INVALID_PASSWORD", logId]);

        return res.status(401).json({
          message: newFailedAttempts === 4 
            ? "ATTENTION : Dernière tentative avant blocage du compte !"
            : `Email ou mot de passe incorrect. Il vous reste ${5 - newFailedAttempts} tentatives.`,
          attemptsLeft: 5 - newFailedAttempts
        });
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }
    }

    try {
      // Vérification des activités suspectes
      const securityAlerts = await SecurityMonitoring.checkLoginPattern({
        userId: user.id,
        email: user.email,
        ip: clientIp,
        deviceId,
        userAgent
      });

      // Mise à jour utilisateur sans transaction (pas besoin car une seule opération)
      await pool.query(
        `UPDATE users SET 
         failed_attempts = 0, 
         lock_until = NULL, 
         last_login = NOW(),
         last_ip = ?,
         last_user_agent = ?
         WHERE id = ?`,
        [clientIp, userAgent, user.id]
      );

      // Mise à jour log de sécurité
      await pool.query(
        "UPDATE security_logs SET status = ?, error = ? WHERE id = ?",
        ["SUCCESS", JSON.stringify({ deviceId }), logId]
      );

      const response = {
        message: "Connexion réussie",
        user: {
          id: user.id,
          email: user.email,
          rank: user.rank,
          credits: user.credits,
          last_login: new Date()
        }
      };

      // Ajouter les alertes si présentes
      if (securityAlerts?.length > 0) {
        response.alerts = securityAlerts;
      }

      res.status(200).json(response);
    } catch (error) {
      console.error("Error during login process:", error);
      throw error;
    }
  } catch (error) {
    console.error("Login error:", error);
    if (logId) {
      await pool.query(
        "UPDATE security_logs SET status = ?, error = ? WHERE id = ?",
        ["FAILED_SERVER_ERROR", error.message, logId]
      );
    }
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
}