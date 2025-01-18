import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token et mot de passe requis" });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: "Le mot de passe doit faire au moins 8 caractères" 
      });
    }

    // Récupérer le reset token et vérifier que l'utilisateur n'utilise pas Google
    const [resets] = await pool.query(
      `SELECT pr.*, u.google_id 
       FROM password_resets pr 
       JOIN users u ON pr.user_id = u.id 
       WHERE pr.token = ? AND pr.expires_at > NOW()`,
      [token]
    );

    if (resets.length === 0) {
      return res.status(400).json({ 
        message: "Token invalide ou expiré" 
      });
    }

    // Vérifier si c'est un compte Google
    if (resets[0].google_id) {
      return res.status(400).json({ 
        message: "Impossible de réinitialiser le mot de passe d'un compte Google. Veuillez utiliser la connexion Google." 
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour le mot de passe
    await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, resets[0].user_id]
    );

    // Supprimer le token utilisé
    await pool.query(
      "DELETE FROM password_resets WHERE token = ?",
      [token]
    );

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur reset password:", error);
    res.status(500).json({ message: "Une erreur est survenue" });
  }
}