import pool from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount = 1 } = req.body;
    let userId = null;

    // Vérifie d'abord la session NextAuth
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email) {
      const [users] = await pool.query(
        "SELECT id, credits FROM users WHERE email = ?",
        [session.user.email]
      );
      if (users.length > 0) {
        userId = users[0].id;
        // Vérifier si l'utilisateur a assez de crédits
        if (users[0].credits < amount) {
          return res.status(400).json({ 
            message: "Crédits insuffisants",
            currentBalance: users[0].credits 
          });
        }
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
        
        // Vérifier le solde pour l'auth traditionnelle
        const [userCheck] = await pool.query(
          "SELECT credits FROM users WHERE id = ?",
          [userId]
        );
        
        if (userCheck[0].credits < amount) {
          return res.status(400).json({ 
            message: "Crédits insuffisants",
            currentBalance: userCheck[0].credits 
          });
        }
      }
    }

    // Si aucune authentification n'est valide
    if (!userId) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    // Retirer les crédits
    await pool.query(
      `UPDATE users 
       SET credits = credits - ?, 
           updated_at = NOW() 
       WHERE id = ?`,
      [amount, userId]
    );

    // Log de la transaction
    await pool.query(
      `INSERT INTO credit_transactions 
       (user_id, amount, type, created_at) 
       VALUES (?, ?, 'REMOVE', NOW())`,
      [userId, amount]
    );

    // Récupérer le nouveau solde
    const [users] = await pool.query(
      "SELECT credits FROM users WHERE id = ?",
      [userId]
    );

    res.status(200).json({
      message: "Crédits retirés avec succès",
      newBalance: users[0].credits
    });

  } catch (error) {
    console.error("Erreur lors du retrait des crédits:", error);
    res.status(500).json({ message: "Erreur lors du retrait des crédits" });
  }
}