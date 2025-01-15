import bcrypt from "bcryptjs";
import pool from "../../../lib/db";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const { email, password, rememberMe = false } = req.body;

    if (!validateEmail(email) || !password) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide." });
    }

    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = users[0];

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const now = new Date();
    if (user.lock_until && new Date(user.lock_until) > now) {
      const lockTime = Math.ceil((new Date(user.lock_until) - now) / 1000 / 60);
      return res.status(403).json({
        message: `Compte temporairement verrouillé. Réessayez dans ${lockTime} minutes.`,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      // Incrémenter le compteur de tentatives échouées
      await pool.query(
        "UPDATE users SET failed_attempts = failed_attempts + 1 WHERE email = ?",
        [email]
      );

      // Vérifier si on doit verrouiller le compte
      if (user.failed_attempts + 1 >= 5) {
        await pool.query(
          "UPDATE users SET lock_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE email = ?",
          [email]
        );
        return res.status(403).json({
          message: "Trop de tentatives. Compte verrouillé pour 30 minutes.",
        });
      }

      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
        attemptsLeft: 5 - (user.failed_attempts + 1),
      });
    }

    const token = crypto.randomBytes(64).toString("hex");
    const sessionDuration = rememberMe ? 30 : 7; // 30 jours ou 7 jours

    await pool.query(
      "DELETE FROM sessions WHERE user_id = ? OR expires_at < NOW()",
      [user.id]
    );

    try {
      await pool.query(
        `INSERT INTO sessions (user_id, token, expires_at) 
         VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
        [user.id, token, sessionDuration]
      );
    } catch (error) {
      console.error("Erreur lors de l'insertion de la session:", error);
      return res.status(500).json({
        message: "Erreur lors de la création de la session",
      });
    }

    await pool.query(
      `UPDATE users 
       SET failed_attempts = 0, 
           lock_until = NULL, 
           last_login = NOW(),
           last_ip = ?,
           last_user_agent = ?
       WHERE email = ?`,
      [
        req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        req.headers["user-agent"],
        email,
      ]
    );

    const maxAge = sessionDuration * 24 * 60 * 60; // en secondes
    res.setHeader(
      "Set-Cookie",
      `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
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
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
}
