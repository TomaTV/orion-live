import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code, newPassword } = req.body;

  try {
    // Vérifier si le code est valide
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

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      resets[0].user_id,
    ]);

    // Supprimer le code utilisé
    await pool.query("DELETE FROM password_resets WHERE user_id = ?", [
      resets[0].user_id,
    ]);

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur lors de la réinitialisation" });
  }
}
