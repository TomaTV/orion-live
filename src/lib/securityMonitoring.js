import pool from './db';
import { SecurityMailer } from './mailer';

async function sendSecureEmail(email, type, data) {
  if (!email || !process.env.SMTP_ENABLED || process.env.SMTP_ENABLED === 'false') {
    console.log('SMTP désactivé ou email manquant, skip de l\'envoi:', { to: email, type, data });
    return;
  }

  try {
    await SecurityMailer.sendSecurityAlert(email, type, data);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
}

export const SecurityMonitoring = {
  async checkNewDevice({ userId, deviceId, userAgent, ip }) {
    try {
      const [currentSessions] = await pool.query(
        `SELECT * FROM sessions WHERE user_id = ? AND expires_at > NOW()`,
        [userId]
      );
      
      const [devices] = await pool.query(
        'SELECT id FROM user_devices WHERE user_id = ? AND device_id = ?',
        [userId, deviceId]
      );

      const [userDevices] = await pool.query(
        'SELECT COUNT(*) as count FROM user_devices WHERE user_id = ?',
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
                timestamp: new Date().toISOString()
              })
            ]
          );

          const [user] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
          if (user[0]?.email) {
            await sendSecureEmail(user[0].email, 'NEW_DEVICE_LOGIN', {
              deviceId,
              userAgent,
              ip,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du nouvel appareil:', error);
      throw error;
    }
  },

  async checkConcurrentSessions({ userId, deviceId, ip }) {
    try {
      const [activeSessions] = await pool.query(
        `SELECT *
         FROM sessions 
         WHERE user_id = ? 
         AND device_id != ?
         AND expires_at > NOW()`,
        [userId, deviceId]
      );
      
      if (activeSessions.length > 0) {
        // Invalider toutes les autres sessions
        await pool.query(
          `UPDATE sessions 
           SET expires_at = NOW()
           WHERE user_id = ? AND device_id != ?`,
          [userId, deviceId]
        );

        // Créer une alerte sans envoi d'email
        await pool.query(
          `INSERT INTO user_alerts (user_id, type, severity, details)
           VALUES (?, 'CONCURRENT_SESSIONS', 'HIGH', ?)`,
          [userId, JSON.stringify({
            currentDeviceId: deviceId,
            currentIp: ip,
            otherSessions: activeSessions,
            timestamp: new Date().toISOString()
          })]
        );

        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification des sessions concurrentes:', error);
      throw error;
    }
  },

  async checkIpChange({ userId, newIp }) {
    try {
      const [lastLogin] = await pool.query(
        'SELECT last_ip, email FROM users WHERE id = ?',
        [userId]
      );

      if (lastLogin[0]?.last_ip && lastLogin[0].last_ip !== newIp) {
        const alertDetails = {
          previousIp: lastLogin[0].last_ip,
          newIp,
          timestamp: new Date().toISOString()
        };

        await pool.query(
          `INSERT INTO user_alerts (user_id, type, severity, details)
           VALUES (?, 'IP_CHANGE', 'MEDIUM', ?)`,
          [userId, JSON.stringify(alertDetails)]
        );

        await sendSecureEmail(lastLogin[0].email, 'IP_CHANGE', alertDetails);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du changement d\'IP:', error);
      throw error;
    }
  },

  async checkLoginPattern({ userId, email, ip, deviceId, userAgent }) {
    try {
      // Vérifier les conditions de sécurité
      await Promise.all([
        this.checkNewDevice({ userId, deviceId, userAgent, ip }),
        this.checkConcurrentSessions({ userId, deviceId, ip }),
        this.checkIpChange({ userId, newIp: ip })
      ]);

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

      return alerts;
    } catch (error) {
      console.error('Erreur lors de la vérification des patterns de sécurité:', error);
      throw error;
    }
  }
};