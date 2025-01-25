import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/security";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Les deux mots de passe sont requis" });
    }

    // Validation du nouveau mot de passe
    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.isValid) {
      return res.status(400).json({
        message: "Le mot de passe ne respecte pas les critères de sécurité",
        errors: passwordCheck.errors,
      });
    }

    // Vérification de l'utilisateur
    const [users] = await pool.query(
      "SELECT id, password, google_id FROM users WHERE email = ? AND deleted_at IS NULL",
      [session.user.email]
    );

    if (!users[0]) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Blocage pour les comptes Google
    if (users[0].google_id) {
      return res.status(400).json({
        message: "Impossible de changer le mot de passe d'un compte Google",
      });
    }

    // Vérification de l'ancien mot de passe
    const isValid = await bcrypt.compare(currentPassword, users[0].password);
    if (!isValid) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    // Hashage et mise à jour
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await pool.query(
      "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
      [hashedPassword, users[0].id]
    );

    // Log de sécurité
    await pool.query(
      `INSERT INTO security_logs (
       type,
       email,
       status,
       ip_address,
       user_agent
     ) VALUES (?, ?, ?, ?, ?)`,
      [
        "PASSWORD_CHANGE",
        session.user.email,
        "SUCCESS",
        req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        req.headers["user-agent"],
      ]
    );

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur change password:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du mot de passe" });
  }
}
