import pool from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const token = req.cookies.auth;

    if (token) {
      // Supprimer la session traditionnelle
      await pool.query("DELETE FROM sessions WHERE token = ?", [token]);
      res.setHeader(
        "Set-Cookie",
        "auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:01 GMT"
      );
    }

    // Pour NextAuth, la session sera gérée automatiquement
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
}
