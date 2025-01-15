import pool from "@/lib/db";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  try {
    // Vérifier si l'email existe
    const [users] = await pool.query(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Email non trouvé" });
    }

    const user = users[0];
    // Générer un code à 6 chiffres
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 30 * 60000); // 30 minutes

    // Supprimer les anciens codes
    await pool.query("DELETE FROM password_resets WHERE user_id = ?", [
      user.id,
    ]);

    // Insérer le nouveau code
    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, resetCode, expiryDate]
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Code de réinitialisation de mot de passe",
      html: `
        <h1>Réinitialisation de votre mot de passe</h1>
        <p>Voici votre code de réinitialisation :</p>
        <h2 style="font-size: 24px; letter-spacing: 5px; padding: 20px; background: #f5f5f5; text-align: center;">${resetCode}</h2>
        <p>Ce code expirera dans 30 minutes.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      `,
    });

    res.status(200).json({ message: "Code envoyé par email" });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur lors de l'envoi du code" });
  }
}
