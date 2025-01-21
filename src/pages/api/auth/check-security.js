import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { userId, deviceId, userAgent, ip } = req.body;

    // 1. Vérifier nouveau device
    const [devices] = await pool.query(
      "SELECT id FROM user_devices WHERE user_id = ? AND device_id = ?",
      [userId, deviceId]
    );

    const [userDevices] = await pool.query(
      "SELECT COUNT(*) as count FROM user_devices WHERE user_id = ?",
      [userId]
    );

    const isTrusted = userDevices[0]?.count === 0;

    if (devices.length === 0) {
      await pool.query(
        `INSERT INTO user_devices (user_id, device_id, user_agent, last_ip, is_trusted)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, deviceId, userAgent, ip, isTrusted]
      );

      if (!isTrusted) {
        await pool.query(
          `INSERT INTO user_alerts (user_id, type, severity, details)
           VALUES (?, 'NEW_DEVICE_LOGIN', 'HIGH', ?)`,
          [
            userId,
            JSON.stringify({
              deviceId,
              userAgent,
              ip,
              timestamp: new Date().toISOString(),
            }),
          ]
        );
      }
    }

    // 2. Vérifier sessions concurrentes
    const [activeSessions] = await pool.query(
      `SELECT *
       FROM sessions 
       WHERE user_id = ? 
       AND device_id != ?
       AND expires_at > NOW()`,
      [userId, deviceId]
    );

    if (activeSessions.length > 0) {
      await pool.query(
        `INSERT INTO user_alerts (user_id, type, severity, details)
         VALUES (?, 'CONCURRENT_SESSIONS', 'HIGH', ?)`,
        [
          userId,
          JSON.stringify({
            currentDeviceId: deviceId,
            currentIp: ip,
            otherSessions: activeSessions,
            timestamp: new Date().toISOString(),
          }),
        ]
      );

      await pool.query(
        `UPDATE sessions 
         SET expires_at = NOW()
         WHERE user_id = ? AND device_id != ?`,
        [userId, deviceId]
      );
    }

    // 3. Vérifier changement d'IP
    const [lastLogin] = await pool.query(
      "SELECT last_ip, email FROM users WHERE id = ?",
      [userId]
    );

    if (lastLogin[0]?.last_ip && lastLogin[0].last_ip !== ip) {
      await pool.query(
        `INSERT INTO user_alerts (user_id, type, severity, details)
         VALUES (?, 'IP_CHANGE', 'MEDIUM', ?)`,
        [
          userId,
          JSON.stringify({
            previousIp: lastLogin[0].last_ip,
            newIp: ip,
            timestamp: new Date().toISOString(),
          }),
        ]
      );
    }

    // Récupérer les alertes actives
    const [alerts] = await pool.query(
      `SELECT type, details, created_at 
       FROM user_alerts 
       WHERE user_id = ? 
       AND status = 'PENDING' 
       AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
       ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({ alerts });
  } catch (error) {
    console.error("Erreur lors des vérifications de sécurité:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
