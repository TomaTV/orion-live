import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import pool from "../../../lib/db";

async function validateSettings(settings) {
  const errors = [];

  // Validation du thème
  if (settings.theme && !["dark", "light"].includes(settings.theme)) {
    errors.push("Thème invalide");
  }

  // Validation des noms
  if (
    settings.firstName &&
    (settings.firstName.length < 2 || settings.firstName.length > 50)
  ) {
    errors.push("Le prénom doit contenir entre 2 et 50 caractères");
  }
  if (
    settings.lastName &&
    (settings.lastName.length < 2 || settings.lastName.length > 50)
  ) {
    errors.push("Le nom doit contenir entre 2 et 50 caractères");
  }

  // Validation URL avatar
  if (settings.avatarUrl && !settings.avatarUrl.startsWith("https://")) {
    errors.push("L'URL de l'avatar doit être sécurisée (https)");
  }

  if (
    settings.notifications_report !== undefined &&
    typeof settings.notifications_report !== "boolean"
  ) {
    errors.push("Format des notifications invalide");
  }

  return errors;
}

export default async function handler(req, res) {
  let logId = null;

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Informations de sécurité
    const userIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";
    const userAgent = req.headers["user-agent"] || "unknown";

    if (req.method === "GET") {
      // Récupération des données utilisateur
      const [userData] = await pool.query(
        `SELECT 
          p.first_name AS firstName,
          p.last_name AS lastName,
          p.avatar_url AS avatarUrl,
          us.theme,
          us.notifications_report AS emailReports,
          us.notifications_offers AS emailPromotions,
          us.notifications_security AS emailSecurity
        FROM profiles p
        LEFT JOIN user_settings us ON p.user_id = us.user_id
        WHERE p.user_id = ?`,
        [userId]
      );

      if (userData.length === 0) {
        return res.status(404).json({ message: "Profil non trouvé." });
      }

      return res.status(200).json(userData[0]);
    }

    if (req.method === "POST") {
      const {
        theme,
        firstName,
        lastName,
        avatarUrl,
        notifications_report,
        notifications_offers,
        notifications_security,
      } = req.body;

      const validationErrors = await validateSettings({
        theme,
        firstName,
        lastName,
        avatarUrl,
      });

      if (validationErrors.length > 0) {
        return res.status(400).json({
          message: "Données invalides",
          errors: validationErrors,
        });
      }

      // Log initial de tentative de mise à jour
      const [logInsert] = await pool.query(
        `INSERT INTO security_logs (type, email, ip_address, user_agent, status)
         VALUES (?, ?, ?, ?, ?)`,
        ["SETTINGS_UPDATE_ATTEMPT", userEmail, userIp, userAgent, "PENDING"]
      );
      logId = logInsert.insertId;

      await pool.query("START TRANSACTION");

      try {
        // Mise à jour des paramètres utilisateur
        await pool.query(
          `INSERT INTO user_settings (
            user_id, 
            theme,
            notifications_report,
            notifications_offers,
            notifications_security
          ) VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            theme = COALESCE(?, theme),
            notifications_report = COALESCE(?, notifications_report),
            notifications_offers = COALESCE(?, notifications_offers),
            notifications_security = COALESCE(?, notifications_security)`,
          [
            userId,
            theme,
            notifications_report,
            notifications_offers,
            notifications_security,
            theme,
            notifications_report,
            notifications_offers,
            notifications_security,
          ]
        );

        // Mise à jour ou insertion dans la table "profiles"
        if (firstName || lastName || avatarUrl !== undefined) {
          await pool.query(
            `INSERT INTO profiles (user_id, first_name, last_name, avatar_url)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               first_name = ?,
               last_name = ?,
               avatar_url = ?`,
            [
              userId,
              firstName || null,
              lastName || null,
              avatarUrl || null,
              firstName || null,
              lastName || null,
              avatarUrl || null,
            ]
          );
        }

        // Log succès
        await pool.query(
          `UPDATE security_logs
           SET status = ?, error = ?
           WHERE id = ?`,
          ["SUCCESS", null, logId]
        );

        await pool.query("COMMIT");

        // Récupération des données mises à jour
        const [updatedSettings] = await pool.query(
          `SELECT 
            p.first_name AS firstName,
            p.last_name AS lastName,
            p.avatar_url AS avatarUrl,
            us.theme,
            us.notifications_report AS emailReports,
            us.notifications_offers AS emailPromotions,
            us.notifications_security AS emailSecurity
          FROM profiles p
          LEFT JOIN user_settings us ON p.user_id = us.user_id
          WHERE p.user_id = ?`,
          [userId]
        );

        return res.status(200).json({
          message: "Paramètres mis à jour avec succès",
          settings: updatedSettings[0],
        });
      } catch (error) {
        await pool.query("ROLLBACK");

        // Log échec
        if (logId) {
          await pool.query(
            `UPDATE security_logs
             SET status = ?, error = ?
             WHERE id = ?`,
            ["FAILED", error.message, logId]
          );
        }

        throw error;
      }
    }

    return res.status(405).json({ message: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur API utilisateur :", error);

    if (logId) {
      await pool.query(
        `UPDATE security_logs
         SET status = ?, error = ?
         WHERE id = ?`,
        ["FAILED_SERVER_ERROR", error.message, logId]
      );
    }

    res.status(500).json({
      message: "Erreur lors du traitement",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
