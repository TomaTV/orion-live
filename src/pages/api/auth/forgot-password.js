import pool from "@/lib/db";
import { validateEmail } from "@/lib/validation";
import nodemailer from "nodemailer";

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Au lieu de host et port
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    // Vérifier si l'utilisateur existe
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Aucun compte trouvé avec cet email",
      });
    }

    const user = users[0];

    // Si c'est un compte Google
    if (user.google_id || !user.password) {
      return res.status(400).json({
        message: "Ce compte utilise la connexion Google. Veuillez vous connecter avec Google.",
        isGoogleAccount: true
      });
    }

    // Pour un compte normal : générer un code et l'envoyer par email
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Supprimer les anciens codes
    await pool.query(
      "DELETE FROM password_resets WHERE user_id = ?",
      [user.id]
    );

    // Créer un nouveau code
    await pool.query(
      `INSERT INTO password_resets (user_id, token, expires_at) 
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
      [user.id, resetCode]
    );

    // Envoyer l'email avec le code
    try {
      // Tester la connexion SMTP d'abord
      await transporter.verify();

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Code de réinitialisation de votre mot de passe",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Réinitialisation de votre mot de passe</h2>
            <p>Voici votre code de réinitialisation :</p>
            <div style="padding: 20px; background-color: #f3f4f6; border-radius: 5px; text-align: center; margin: 20px 0;">
              <h1 style="font-size: 32px; margin: 0; color: #4F46E5;">${resetCode}</h1>
            </div>
            <p>Ce code est valable pendant 1 heure.</p>
            <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
          </div>
        `
      });

      res.status(200).json({
        message: "Un code de réinitialisation a été envoyé à votre adresse email"
      });
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      // Supprimer le code puisque l'email n'a pas été envoyé
      await pool.query(
        "DELETE FROM password_resets WHERE token = ?",
        [resetCode]
      );
      
      // Lancer une erreur plus descriptive
      if (emailError.code === 'EAUTH') {
        throw new Error("Erreur d'authentification SMTP. Vérifiez les identifiants.");
      }
      throw new Error("Erreur lors de l'envoi de l'email: " + emailError.message);
    }

  } catch (error) {
    console.error("Erreur password reset:", error);
    res.status(500).json({ 
      message: error.message || "Une erreur est survenue lors de la réinitialisation"
    });
  }
}