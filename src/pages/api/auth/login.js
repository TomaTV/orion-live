import bcrypt from "bcryptjs";
import pool from "../../../lib/db";
import crypto from "crypto";
import { rateLimit } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/validation";
import { SecurityMonitoring } from "@/lib/securityMonitoring";

// Configuration du rate limiter
const limiter = rateLimit({
  interval: 15 * 60 * 1000,
  maxRequests: 5,
});

export default async function handler(req, res) {
  let logId;
  let clientIp = "::ffff:127.0.0.1";

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Récupération de l'IP et user agent
    const rawIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";
    if (rawIp === "127.0.0.1" || rawIp === "::1") {
      clientIp = "::ffff:127.0.0.1";
    } else {
      clientIp = rawIp;
    }

    const userAgent =
      req.headers["x-user-agent"] || req.headers["user-agent"] || "unknown";
    const deviceId = crypto
      .createHash("sha256")
      .update(userAgent)
      .digest("hex");

    try {
      await limiter.check(clientIp);
    } catch (error) {
      return res.status(429).json({
        message:
          "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
      });
    }

    const { email, password } = req.body;

    if (!email || !password || !validateEmail(email)) {
      return res.status(400).json({
        message:
          !email || !password
            ? "Email et mot de passe requis."
            : "Format d'email invalide.",
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
      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
        "FAILED_NOT_FOUND",
        logId,
      ]);
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérification du compte Google
    if (user.google_id) {
      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
        "FAILED_GOOGLE_ACCOUNT",
        logId,
      ]);
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
      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
        "FAILED_LOCKED",
        logId,
      ]);
      return res.status(403).json({
        message: `Compte temporairement verrouillé. Réessayez dans ${lockTime} minutes.`,
      });
    }

    // Vérification du mot de passe
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      // Mise à jour des tentatives échouées
      await pool.query(
        `UPDATE users 
         SET failed_attempts = failed_attempts + 1,
             lock_until = CASE 
               WHEN (failed_attempts + 1) >= 5 THEN DATE_ADD(NOW(), INTERVAL 30 MINUTE)
               ELSE NULL
             END
         WHERE id = ?`,
        [user.id]
      );

      // Récupération du nombre de tentatives
      const [result] = await pool.query(
        "SELECT failed_attempts FROM users WHERE id = ?",
        [user.id]
      );

      const newFailedAttempts = result[0]?.failed_attempts || 1;

      if (newFailedAttempts >= 5) {
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

      await pool.query("UPDATE security_logs SET status = ? WHERE id = ?", [
        "FAILED_INVALID_PASSWORD",
        logId,
      ]);

      return res.status(401).json({
        message:
          newFailedAttempts === 4
            ? "ATTENTION : Dernière tentative avant blocage du compte !"
            : `Email ou mot de passe incorrect. Il vous reste ${5 - newFailedAttempts} tentatives.`,
        attemptsLeft: 5 - newFailedAttempts,
      });
    }

    try {
      // Vérification et mise à jour du device
      const [existingDevice] = await pool.query(
        "SELECT id, login_count FROM user_devices WHERE user_id = ? AND device_id = ?",
        [user.id, deviceId]
      );

      if (existingDevice.length > 0) {
        // Mettre à jour le compteur de connexions
        await pool.query(
          `UPDATE user_devices 
           SET login_count = login_count + 1,
               last_ip = ?,
               user_agent = ?,
               updated_at = NOW()
           WHERE id = ?`,
          [clientIp, userAgent, existingDevice[0].id]
        );

        // Vérifier si le device doit devenir trusted
        if (
          !existingDevice[0].is_trusted &&
          existingDevice[0].login_count + 1 >= 5
        ) {
          await fetch(`${process.env.NEXTAUTH_URL}/api/users/verify-device`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // Mise à jour légère de l'utilisateur
      await pool.query(
        `UPDATE users 
         SET failed_attempts = 0,
             last_login = NOW(),
             last_ip = ?,
             last_user_agent = ?
         WHERE id = ?`,
        [clientIp, userAgent, user.id]
      );

      // Vérification des activités suspectes
      const securityAlerts = await SecurityMonitoring.checkLoginPattern({
        userId: user.id,
        email: user.email,
        ip: clientIp,
        deviceId,
        userAgent,
      });

      // Mise à jour du log de sécurité
      await pool.query(
        "UPDATE security_logs SET status = ?, error = ? WHERE id = ?",
        ["SUCCESS", JSON.stringify({ deviceId }), logId]
      );

      // Return le minimum requis pour NextAuth
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.email,
      });
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
