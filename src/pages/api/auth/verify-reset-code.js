import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/security";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code, newPassword } = req.body;

  try {
    // Vérifier si l'email existe
    const [users] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Email non trouvé" });
    }

    // Vérification du mot de passe
    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        error: "Mot de passe non valide",
        details: passwordCheck.errors,
        strength: passwordCheck.strength
      });
    }

    // Vérifier si le code est valide et non expiré
    const [resets] = await pool.query(
      `SELECT pr.*, u.email 
       FROM password_resets pr 
       JOIN users u ON pr.user_id = u.id 
       WHERE u.email = ? AND pr.token = ? AND pr.expires_at > NOW()`,
      [email, code]
    );

    if (resets.length === 0) {
      return res.status(400).json({ error: "Code invalide ou expiré" });
    }

    // Hashage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mise à jour dans une transaction
    await pool.query('START TRANSACTION');

    try {
      // Mise à jour du mot de passe
      await pool.query(
        "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
        [hashedPassword, resets[0].user_id]
      );

      // Suppression du code utilisé
      await pool.query(
        "DELETE FROM password_resets WHERE user_id = ?",
        [resets[0].user_id]
      );

      // Log de la réinitialisation réussie
      await pool.query(
        `INSERT INTO security_logs 
         (type, email, ip_address, user_agent, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          'PASSWORD_RESET_SUCCESS',
          email,
          req.headers["x-forwarded-for"] || req.socket.remoteAddress,
          req.headers["user-agent"],
          'SUCCESS'
        ]
      );

      await pool.query('COMMIT');

      res.status(200).json({ 
        message: "Mot de passe mis à jour avec succès"
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error("Erreur:", error);

    // Log de l'erreur
    await pool.query(
      `INSERT INTO security_logs 
       (type, email, ip_address, user_agent, status, error) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'PASSWORD_RESET_ERROR',
        email,
        req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        req.headers["user-agent"],
        'ERROR',
        error.message
      ]
    );

    res.status(500).json({ 
      error: "Erreur lors de la réinitialisation du mot de passe"
    });
  }
}