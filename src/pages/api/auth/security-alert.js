import { SecurityMailer } from "@/lib/mailer";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";

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

    const { userId, type, data } = req.body;

    // Vérifier que l'utilisateur a le droit d'envoyer cette alerte
    if (session.user.id !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Récupérer l'email de l'utilisateur
    const [users] = await pool.query("SELECT email FROM users WHERE id = ?", [
      userId,
    ]);

    if (!users[0]?.email) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Envoyer l'email
    await SecurityMailer.sendSecurityAlert(users[0].email, type, data);

    res.status(200).json({ message: "Alerte envoyée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'alerte:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'alerte" });
  }
}
