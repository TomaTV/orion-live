import nodemailer from "nodemailer";

// Créer le transporteur pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Désactivé pour le développement local
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Ne pas échouer sur les certificats invalides
    rejectUnauthorized: false,
  },
});

// Template pour nouvel appareil
const newDeviceTemplate = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #dc3545;">Connexion depuis un nouvel appareil détectée</h2>
    <p>Une connexion à votre compte a été effectuée depuis un nouvel appareil :</p>
    <ul>
      <li>Date : ${new Date(data.timestamp).toLocaleString()}</li>
      <li>Navigateur : ${data.userAgent}</li>
      <li>Adresse IP : ${data.ip}</li>
    </ul>
    <p>Si ce n'était pas vous, nous vous conseillons de :</p>
    <ol>
      <li>Changer immédiatement votre mot de passe</li>
      <li>Activer l'authentification à deux facteurs</li>
      <li>Contacter notre support</li>
    </ol>
  </div>
`;

// Template pour changement d'IP
const ipChangeTemplate = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #ffc107;">Nouvelle localisation de connexion</h2>
    <p>Une connexion à votre compte a été effectuée depuis une nouvelle adresse IP :</p>
    <ul>
      <li>Date : ${new Date(data.timestamp).toLocaleString()}</li>
      <li>Ancienne IP : ${data.previousIp}</li>
      <li>Nouvelle IP : ${data.newIp}</li>
    </ul>
    <p>Si cette connexion est légitime, vous pouvez ignorer cet email.</p>
  </div>
`;

// Template pour sessions multiples
const concurrentSessionsTemplate = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #dc3545;">Sessions simultanées détectées</h2>
    <p>Nous avons détecté plusieurs connexions actives sur votre compte :</p>
    <h3>Session actuelle :</h3>
    <ul>
      <li>IP : ${data.currentIp}</li>
      <li>Date : ${new Date(data.timestamp).toLocaleString()}</li>
    </ul>
    <h3>Autres sessions actives :</h3>
    <ul>
      ${data.otherSessions
        .map(
          (session) => `
        <li>IP : ${session.ip_address}</li>
        <li>Navigateur : ${session.user_agent}</li>
      `
        )
        .join("")}
    </ul>
    <p>Si vous ne reconnaissez pas certaines de ces sessions, nous vous recommandons de :</p>
    <ol>
      <li>Déconnecter toutes les sessions</li>
      <li>Changer votre mot de passe</li>
    </ol>
  </div>
`;

export const SecurityMailer = {
  /**
   * Envoie un email d'alerte de sécurité
   */
  async sendSecurityAlert(email, type, data) {
    if (!process.env.SMTP_ENABLED || process.env.SMTP_ENABLED === "false") {
      console.log("SMTP désactivé, skip de l'envoi d'email:", {
        to: email,
        type,
        data,
      });
      return;
    }

    let subject;
    let html;

    try {
      switch (type) {
        case "NEW_DEVICE_LOGIN":
          subject = "🔔 Nouvel appareil détecté sur votre compte";
          html = newDeviceTemplate(data);
          break;
        case "IP_CHANGE":
          subject = "🌍 Nouvelle localisation de connexion";
          html = ipChangeTemplate(data);
          break;
        case "CONCURRENT_SESSIONS":
          subject = "⚠️ Sessions multiples détectées";
          html = concurrentSessionsTemplate(data);
          break;
        default:
          throw new Error(`Type d'alerte inconnu: ${type}`);
      }

      await transporter.sendMail({
        from: `"Sécurité Orion" <${process.env.SMTP_FROM}>`,
        to: email,
        subject,
        html,
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email d'alerte:", error);
      // Ne pas propager l'erreur pour ne pas bloquer le processus
    }
  },

  /**
   * Envoie un email de confirmation de déconnexion forcée
   */
  async sendForcedLogoutNotification(email, reason) {
    if (!process.env.SMTP_ENABLED || process.env.SMTP_ENABLED === "false") {
      console.log(
        "SMTP désactivé, skip de l'envoi de notification de déconnexion forcée"
      );
      return;
    }

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Déconnexion de sécurité</h2>
          <p>Pour votre sécurité, nous avons déconnecté toutes vos sessions actives.</p>
          <p>Raison : ${reason}</p>
          <p>Si vous avez des questions, n'hésitez pas à contacter notre support.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Sécurité Orion" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: "🔒 Déconnexion de sécurité effectuée",
        html,
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de la notification de déconnexion forcée:",
        error
      );
      // Ne pas propager l'erreur pour ne pas bloquer le processus
    }
  },
};

export default transporter;
