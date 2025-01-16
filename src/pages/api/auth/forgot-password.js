import pool from "@/lib/db";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/validation";
import { generateSecureCode } from "@/lib/security";

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 heure
  maxRequests: 3, // 3 tentatives par heure
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    try {
      // Vérification du rate limit
      await limiter.check(clientIp);

      const { email } = req.body;

      // Validation de l'email
      if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: "Format d'email invalide" });
      }

      // Vérifier si l'email existe
      const [users] = await pool.query(
        "SELECT id, email FROM users WHERE email = ? AND deleted_at IS NULL",
        [email]
      );

      // Si l'email n'existe pas dans la base de données
      if (!users || users.length === 0) {
        return res.status(404).json({
          error: "Aucun compte n'existe avec cet email",
        });
      }

      const user = users[0];

      // Génération du code de réinitialisation
      const resetCode = generateSecureCode(6);
      const expiryDate = new Date(Date.now() + 30 * 60000); // 30 minutes

      await pool.query("START TRANSACTION");

      try {
        // Supprimer les anciens codes
        await pool.query(
          "DELETE FROM password_resets WHERE user_id = ? OR expires_at < NOW()",
          [user.id]
        );

        // Insérer le nouveau code
        await pool.query(
          `INSERT INTO password_resets (user_id, token, expires_at) 
           VALUES (?, ?, ?)`,
          [user.id, resetCode, expiryDate]
        );

        await pool.query("COMMIT");

        // Envoi d'email
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const emailTemplate = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de mot de passe</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #121212;
              color: #FFFFFF;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #1E1E1E;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #333;
            }
            .header h1 {
              font-size: 24px;
              margin: 0;
              color: #E2E8F0;
            }
            .content {
              padding: 20px;
              text-align: center;
            }
            .content p {
              margin: 0 0 15px;
              color: #A0AEC0;
            }
            .code {
              display: inline-block;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 4px;
              color: #38BDF8;
              background-color: #2D3748;
              padding: 10px 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              text-align: center;
              color: #718096;
            }
            .footer a {
              color: #38BDF8;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Réinitialisation de votre mot de passe</h1>
            </div>
            <div class="content">
              <p>Voici votre code de réinitialisation :</p>
              <div class="code">${resetCode}</div>
              <p><strong>Ce code expirera dans 30 minutes.</strong></p>
              <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
            </div>
            <div class="footer">
              <p>Besoin d'aide ? <a href="mailto:support@orion.com">Contactez-nous</a>.</p>
            </div>
          </div>
        </body>
        </html>
        `;

        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            html: emailTemplate,
          });

          res.status(200).json({
            message: "Un email de réinitialisation a été envoyé",
          });
        } catch (emailError) {
          console.error("Erreur d'envoi d'email:", emailError); // Conserver ce log critique
          await pool.query("ROLLBACK");
          res.status(500).json({
            error: "Erreur lors de l'envoi de l'email de réinitialisation",
          });
        }
      } catch (error) {
        console.error("Erreur transaction:", error); // Conserver ce log critique
        await pool.query("ROLLBACK");
        throw error;
      }
    } catch (error) {
      console.error("Erreur:", error); // Conserver pour des erreurs critiques
      if (error.code === "ECONNREFUSED") {
        res.status(500).json({
          error: "Erreur de connexion à la base de données",
        });
      } else {
        // Capture d'autres erreurs et log des détails supplémentaires
        res.status(404).json({
          error: "Aucun compte n'existe avec cet email",
        });
      }
    }
  } else {
    // Méthode HTTP non autorisée
    console.error("Méthode non autorisée :", req.method);
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
