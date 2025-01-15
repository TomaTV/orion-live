import pool from "../../../lib/db";
import { parse } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Vérifier le cookie d'authentification
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const authToken = cookies.auth;

    if (!authToken) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // Récupérer l'utilisateur depuas la session
    const [sessions] = await pool.query(
      "SELECT user_id FROM sessions WHERE token = ? AND expires_at > NOW()",
      [authToken]
    );

    if (sessions.length === 0) {
      return res.status(401).json({ message: "Session invalide ou expirée" });
    }

    const userId = sessions[0].user_id;

    // Récupérer les informations de l'utilisateur
    const [users] = await pool.query(
      "SELECT id, email, credits FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = users[0];

    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur API utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
