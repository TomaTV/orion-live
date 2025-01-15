import bcrypt from "bcryptjs";
import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 6;

    if (
      !validateEmail(req.body.email) ||
      !validatePassword(req.body.password)
    ) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe invalide." });
    }

    const { email, password } = req.body;

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Compte créé avec succès" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Erreur lors de la création du compte" });
  }
}
