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

  // Récupération de l'IP pour le rate limiting
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

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

    // Log de tentative de connexion
    await pool.query(
      `INSERT INTO security_logs (type, email, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?)`,
      ["LOGIN_ATTEMPT", email, clientIp, req.headers["user-agent"], "PENDING"]
    );

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
      await pool.query(
        "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
        ["FAILED_NOT_FOUND", email, "LOGIN_ATTEMPT"]
      );
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
      await pool.query(
        "UPDATE users SET failed_attempts = failed_attempts + 1 WHERE email = ?",
        [email]
      );

      // Vérification du nombre de tentatives
      if (user.failed_attempts + 1 >= 5) {
        await pool.query(
          "UPDATE users SET lock_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE email = ?",
          [email]
        );
        await pool.query(
          "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
          ["FAILED_MAX_ATTEMPTS", email, "LOGIN_ATTEMPT"]
        );
        return res.status(403).json({
          message: "Trop de tentatives. Compte verrouillé pour 30 minutes.",
        });
      }

      await pool.query(
        "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
        ["FAILED_INVALID_PASSWORD", email, "LOGIN_ATTEMPT"]
      );
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
        attemptsLeft: 5 - (user.failed_attempts + 1),
      });
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
      await pool.query(
        "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
        ["FAILED_SESSION_CREATE", email, "LOGIN_ATTEMPT"]
      );
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
      [clientIp, req.headers["user-agent"], email]
    );

    // Configuration du cookie
    const maxAge = sessionDuration * 24 * 60 * 60;
    res.setHeader(
      "Set-Cookie",
      `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
    );

    // Log du succès de la connexion
    await pool.query(
      "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
      ["SUCCESS", email, "LOGIN_ATTEMPT"]
    );

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
    await pool.query(
      "UPDATE security_logs SET status = ?, error = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
      ["FAILED_SERVER_ERROR", error.message, email, "LOGIN_ATTEMPT"]
    );
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
}
