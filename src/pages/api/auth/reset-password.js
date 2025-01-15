import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, newPassword } = req.body;

  try {
    // Vérifier le token
    const [resets] = await pool.query(
      `SELECT user_id FROM password_resets 
       WHERE token = ? AND expires_at > NOW()`,
      [token]
    );

    if (resets.length === 0) {
      return res.status(400).json({ error: "Token invalide ou expiré" });
    }

    const userId = resets[0].user_id;

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    // Supprimer le token utilisé
    await pool.query("DELETE FROM password_resets WHERE user_id = ?", [userId]);

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la réinitialisation du mot de passe" });
  }
}
