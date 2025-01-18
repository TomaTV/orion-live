import pool from "../../../lib/db";
import { parse } from "cookie";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let userId = null;

    // Vérifier d'abord la session NextAuth
    const session = await getServerSession(req, res, authOptions);
    
    if (session?.user?.email) {
      // Récupérer l'ID utilisateur depuis l'email de la session NextAuth
      const [users] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [session.user.email]
      );
      
      if (users.length > 0) {
        userId = users[0].id;
      }
    }

    // Si pas de session NextAuth, essayer avec le cookie auth classique
    if (!userId) {
      const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
      const authToken = cookies.auth;

      if (authToken) {
        const [sessions] = await pool.query(
          "SELECT user_id FROM sessions WHERE token = ? AND expires_at > NOW()",
          [authToken]
        );

        if (sessions.length > 0) {
          userId = sessions[0].user_id;
        }
      }
    }

    // Si aucune authentification n'est valide
    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // Récupérer les informations de l'utilisateur
    const [users] = await pool.query(
      `SELECT 
        id, 
        email, 
        credits,
        rank
      FROM users 
      WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = users[0];

    // Récupérer les paramètres de l'utilisateur
    const [settings] = await pool.query(
      "SELECT theme FROM user_settings WHERE user_id = ?",
      [userId]
    );

    // Ajouter le thème aux données utilisateur
    const userInfo = {
      ...user,
      theme: settings.length > 0 ? settings[0].theme : "dark", // Valeur par défaut : dark
    };

    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Erreur API utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}