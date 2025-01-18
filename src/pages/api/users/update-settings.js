import pool from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { theme } = req.body;
    let userId = null;

    // Vérifie d'abord la session NextAuth
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email) {
      const [users] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [session.user.email]
      );
      if (users.length > 0) {
        userId = users[0].id;
      }
    }

    // Si pas de session NextAuth, essaie la méthode traditionnelle
    if (!userId) {
      const [sessions] = await pool.query(
        "SELECT user_id FROM sessions WHERE token = ?",
        [req.cookies.auth]
      );
      
      if (sessions.length > 0) {
        userId = sessions[0].user_id;
      }
    }

    // Si aucune authentification n'est valide
    if (!userId) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    // Vérifier si l'utilisateur a déjà des settings
    const [existingSettings] = await pool.query(
      "SELECT id FROM user_settings WHERE user_id = ?",
      [userId]
    );

    if (existingSettings.length > 0) {
      // Mettre à jour les settings existants
      await pool.query(
        `UPDATE user_settings 
         SET theme = ?, updated_at = NOW() 
         WHERE user_id = ?`,
        [theme, userId]
      );
    } else {
      // Créer de nouveaux settings
      await pool.query(
        `INSERT INTO user_settings 
         (user_id, theme, email_notifications, language) 
         VALUES (?, ?, true, 'fr')`,
        [userId, theme]
      );
    }

    res.status(200).json({ message: "Préférences mises à jour" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des préférences:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}