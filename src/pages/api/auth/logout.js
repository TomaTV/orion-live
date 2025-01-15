import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const token = req.cookies.auth;

    if (!token) {
      return res.status(400).json({ message: "Token de session manquant" });
    }

    await pool.query("DELETE FROM sessions WHERE token = ?", [token]);

    res.setHeader(
      "Set-Cookie",
      "auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:01 GMT"
    );

    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
}
