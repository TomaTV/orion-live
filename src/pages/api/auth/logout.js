import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './[...nextauth]';
import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    // Récupérer et normaliser l'IP
    let clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";
    if (clientIp === "127.0.0.1" || clientIp === "::1") {
      clientIp = "::ffff:127.0.0.1";
    }

    // Récupérer la session directement du serveur
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Récupérer les infos utilisateur
    const [users] = await pool.query(
      'SELECT id, email, last_ip, last_user_agent, google_id FROM users WHERE email = ? AND deleted_at IS NULL',
      [session.user.email]
    );

    if (!users[0]) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = users[0];

    // 1. Log de déconnexion
    await pool.query(
      `INSERT INTO security_logs (type, email, ip_address, user_agent, status, error)
       VALUES (?, ?, ?, ?, 'SUCCESS', ?)`,
      [
        user.google_id ? 'GOOGLE_LOGOUT' : 'LOGOUT',
        user.email,
        user.last_ip,
        user.last_user_agent,
        JSON.stringify({ provider: user.google_id ? 'google' : 'credentials' })
      ]
    );

    // 2. Supprimer toutes les sessions
    const [deleteResult] = await pool.query(
      'DELETE FROM sessions WHERE user_id = ?',
      [user.id]
    );

    console.log('Sessions supprimées:', deleteResult.affectedRows);

    res.status(200).json({
      message: 'Déconnexion réussie',
      sessionsRemoved: deleteResult.affectedRows
    });
  } catch (error) {
    console.error('Erreur logout:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}
