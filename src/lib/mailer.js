import nodemailer from "nodemailer";

// Créer le transporteur pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Envoie un email de réinitialisation de mot de passe
 */
export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/password-reset?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Réinitialisation de mot de passe</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe sur Orion. Pour procéder, cliquez sur le lien ci-dessous :</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 20px 0;">
        Réinitialiser mon mot de passe
      </a>
      <p>Ce lien est valable pendant 1 heure.</p>
      <p>Si vous n'avez pas demandé de réinitialisation, ignorez simplement cet email.</p>
      <p style="margin-top: 40px; color: #666; font-size: 14px;">
        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Orion" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Réinitialisation de votre mot de passe Orion",
    html: html,
  });
}
