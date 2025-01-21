import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    // Récupérer et normaliser l'IP
    let clientIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";
    if (clientIp === "127.0.0.1" || clientIp === "::1") {
      clientIp = "::ffff:127.0.0.1";
    }

    // Récupérer la session directement du serveur
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Récupérer les infos utilisateur
    const [users] = await pool.query(
      "SELECT id, email, last_ip, last_user_agent, google_id, last_login FROM users WHERE email = ? AND deleted_at IS NULL",
      [session.user.email]
    );

    if (!users[0]) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = users[0];

    // Calculer et sauvegarder la durée de la session
    await pool.query(
      `INSERT INTO session_durations (user_id, start_time, end_time, duration_seconds, type)
       SELECT 
         ?,
         last_login as start_time,
         NOW() as end_time,
         TIMESTAMPDIFF(SECOND, last_login, NOW()) as duration_seconds,
         CASE WHEN google_id IS NOT NULL THEN 'google' ELSE 'credentials' END
       FROM users
       WHERE id = ?`,
      [user.id, user.id]
    );

    // Récupérer la durée pour l'inclure dans les détails du log
    const [sessionInfo] = await pool.query(
      `SELECT TIMESTAMPDIFF(SECOND, last_login, NOW()) as duration
       FROM users WHERE id = ?`,
      [user.id]
    );

    const durationInMinutes = Math.floor(sessionInfo[0].duration / 60);

    // Log de déconnexion avec la durée
    await pool.query(
      `INSERT INTO security_logs (type, email, ip_address, user_agent, status, error)
       VALUES (?, ?, ?, ?, 'SUCCESS', ?)`,
      [
        user.google_id ? "GOOGLE_LOGOUT" : "LOGOUT",
        user.email,
        user.last_ip,
        user.last_user_agent,
        JSON.stringify({
          provider: user.google_id ? "google" : "credentials",
          sessionDuration: `${durationInMinutes} minutes`,
        }),
      ]
    );

    // Supprimer toutes les sessions
    const [deleteResult] = await pool.query(
      "DELETE FROM sessions WHERE user_id = ?",
      [user.id]
    );

    res.status(200).json({
      message: "Déconnexion réussie",
      sessionsRemoved: deleteResult.affectedRows,
      sessionDuration: `${durationInMinutes} minutes`,
    });
  } catch (error) {
    console.error("Erreur logout:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
}
