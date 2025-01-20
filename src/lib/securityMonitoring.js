import pool from './db';
import { SecurityMailer } from './mailer';

/**
 * Fonction utilitaire pour l'envoi sécurisé d'emails
 */
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
    console.log('Checking device:', { userId, deviceId, userAgent, ip });
    try {
      // Vérifier d'abord les sessions concurrentes actuelles
      const [currentSessions] = await pool.query(
        `SELECT * FROM sessions WHERE user_id = ? AND expires_at > NOW()`,
        [userId]
      );
      
      console.log('Current active sessions:', currentSessions);

      // Vérifier si l'appareil a déjà été utilisé
      const [devices] = await pool.query(
        'SELECT id FROM user_devices WHERE user_id = ? AND device_id = ?',
        [userId, deviceId]
      );
      
      console.log('Existing devices:', devices);

      // Si c'est le premier device de l'utilisateur, on le considère comme trusted
      const [userDevices] = await pool.query(
        'SELECT COUNT(*) as count FROM user_devices WHERE user_id = ?',
        [userId]
      );

      const isTrusted = userDevices[0]?.count === 0;
      console.log('Is first device?', isTrusted);

      if (devices.length === 0) {
        await pool.query('START TRANSACTION');

        try {
          // Ajouter le nouvel appareil
          await pool.query(
            `INSERT INTO user_devices (user_id, device_id, user_agent, last_ip, is_trusted)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, deviceId, userAgent, ip, isTrusted]
          );

          // Créer l'alerte seulement si ce n'est pas le premier appareil
          if (!isTrusted) {
            // Créer une alerte pour le nouvel appareil
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

            console.log('Alert created for new device');

            // Envoyer l'alerte par email
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

          await pool.query('COMMIT');
          console.log('Transaction committed for new device');
        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du nouvel appareil:', error);
      throw error;
    }
  },

  async checkConcurrentSessions({ userId, ip }) {
    try {
      // Vérifier les sessions actives depuis d'autres IPs
      const [activeSessions] = await pool.query(
        `SELECT ip_address, user_agent 
         FROM sessions 
         WHERE user_id = ? 
         AND ip_address != ?
         AND expires_at > NOW()`,
        [userId, ip]
      );
      
      console.log('Checking concurrent sessions:', { userId, ip, activeSessions });

      if (activeSessions.length > 0) {
        const alertDetails = {
          currentIp: ip,
          otherSessions: activeSessions,
          timestamp: new Date().toISOString()
        };

        console.log('Creating concurrent sessions alert:', alertDetails);

        await pool.query('START TRANSACTION');

        try {
          // Créer l'alerte
          await pool.query(
            `INSERT INTO user_alerts (user_id, type, severity, details)
             VALUES (?, 'CONCURRENT_SESSIONS', 'HIGH', ?)`,
            [userId, JSON.stringify(alertDetails)]
          );

          // Envoyer l'alerte par email
          const [user] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
          await sendSecureEmail(user[0]?.email, 'CONCURRENT_SESSIONS', alertDetails);

          await pool.query('COMMIT');
          console.log('Concurrent sessions alert created');
        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des sessions concurrentes:', error);
      throw error;
    }
  },

  async checkIpChange({ userId, newIp }) {
    try {
      // Récupérer la dernière IP connue
      const [lastLogin] = await pool.query(
        'SELECT last_ip, email FROM users WHERE id = ?',
        [userId]
      );

      console.log('Checking IP change:', { userId, newIp, lastIp: lastLogin[0]?.last_ip });

      if (lastLogin[0]?.last_ip && lastLogin[0].last_ip !== newIp) {
        const alertDetails = {
          previousIp: lastLogin[0].last_ip,
          newIp,
          timestamp: new Date().toISOString()
        };

        console.log('Creating IP change alert:', alertDetails);

        await pool.query('START TRANSACTION');

        try {
          // Créer l'alerte
          await pool.query(
            `INSERT INTO user_alerts (user_id, type, severity, details)
             VALUES (?, 'IP_CHANGE', 'MEDIUM', ?)`,
            [userId, JSON.stringify(alertDetails)]
          );

          // Envoyer l'alerte par email
          await sendSecureEmail(lastLogin[0].email, 'IP_CHANGE', alertDetails);

          await pool.query('COMMIT');
          console.log('IP change alert created');
        } catch (error) {
          await pool.query('ROLLBACK');
          throw error;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du changement d\'IP:', error);
      throw error;
    }
  },

  async checkLoginPattern({ userId, email, ip, deviceId, userAgent }) {
    console.log('Starting login pattern check:', { userId, email, ip, deviceId });
    try {
      // Vérifier toutes les conditions de sécurité
      await Promise.all([
        this.checkNewDevice({ userId, deviceId, userAgent, ip }),
        this.checkConcurrentSessions({ userId, ip }),
        this.checkIpChange({ userId, newIp: ip })
      ]);

      // Récupérer toutes les alertes actives
      const [alerts] = await pool.query(
        `SELECT type, details, created_at 
         FROM user_alerts 
         WHERE user_id = ? 
         AND status = 'PENDING' 
         AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
         ORDER BY created_at DESC`,
        [userId]
      );

      console.log('Active alerts:', alerts);
      return alerts;
    } catch (error) {
      console.error('Erreur lors de la vérification des patterns de sécurité:', error);
      throw error;
    }
  }
};