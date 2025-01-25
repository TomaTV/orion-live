import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const [users] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND deleted_at IS NULL",
      [session.user.email]
    );

    const userId = users[0]?.id;

    if (!userId) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (req.method === "GET") {
      // Récupérer la liste des appareils
      const [devices] = await pool.query(
        `SELECT 
          id,
          device_id,
          user_agent,
          last_ip,
          is_trusted,
          created_at,
          updated_at
        FROM user_devices 
        WHERE user_id = ?
        ORDER BY created_at DESC`,
        [userId]
      );

      return res.status(200).json(devices);
    }

    if (req.method === "POST") {
      // Déconnecter un appareil
      const { deviceId } = req.body;

      if (!deviceId) {
        return res.status(400).json({ message: "ID de l'appareil requis" });
      }

      await pool.query(
        "DELETE FROM user_devices WHERE device_id = ? AND user_id = ?",
        [deviceId, userId]
      );

      return res.status(200).json({ message: "Appareil déconnecté" });
    }

    // Méthode non autorisée
    return res.status(405).json({ message: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur devices API :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
