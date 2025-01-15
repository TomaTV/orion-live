import pool from "../../../lib/db";
import { parse } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Vérifier le cookie d'authentification
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const authToken = cookies.auth;

    if (!authToken) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // Récupérer l'utilisateur depuis la session
    const [sessions] = await pool.query(
      "SELECT user_id FROM sessions WHERE token = ? AND expires_at > NOW()",
      [authToken]
    );

    if (sessions.length === 0) {
      return res.status(401).json({ message: "Session invalide ou expirée" });
    }

    const userId = sessions[0].user_id;

    // Vérifier les crédits disponibles
    const [users] = await pool.query("SELECT credits FROM users WHERE id = ?", [
      userId,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (users[0].credits < 1) {
      return res.status(400).json({ message: "Crédits insuffisants" });
    }

    // Retirer un crédit
    await pool.query("UPDATE users SET credits = credits - 1 WHERE id = ?", [
      userId,
    ]);

    // Récupérer le nouveau solde
    const [updatedUser] = await pool.query(
      "SELECT credits FROM users WHERE id = ?",
      [userId]
    );

    res.status(200).json({
      message: "Crédit utilisé avec succès",
      credits: updatedUser[0].credits,
    });
  } catch (error) {
    console.error("Erreur lors du retrait du crédit:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
