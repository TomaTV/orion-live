import bcrypt from "bcryptjs";
import pool from "../../../lib/db";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!validateEmail(req.body.email) || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide." });
    }

    const { email, password } = req.body;

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
      return res
        .status(403)
        .json({ message: "Compte verrouillé temporairement." });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      await pool.query(
        "UPDATE users SET failed_attempts = failed_attempts + 1 WHERE email = ?",
        [email]
      );

      if (user.failed_attempts + 1 >= 5) {
        await pool.query(
          "UPDATE users SET lock_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE email = ?",
          [email]
        );
      }
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const token = crypto.randomBytes(64).toString("hex");

    // Réinitialiser les tentatives échouées, supprimer le verrouillage et mettre à jour `last_login`
    await pool.query(
      "UPDATE users SET failed_attempts = 0, lock_until = NULL, last_login = NOW() WHERE email = ?",
      [email]
    );

    await pool.query(
      "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [user.id, token]
    );
    await pool.query("DELETE FROM sessions WHERE expires_at < NOW()");

    res.setHeader(
      "Set-Cookie",
      `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
    );

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        email: user.email,
        last_login: new Date(), // Optionnel, pour le retour client
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
}
