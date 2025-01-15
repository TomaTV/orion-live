import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, amount } = req.body;

    // Validation des entrées
    if (!email || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Email ou montant invalide." });
    }

    // Vérifier si l'utilisateur existe
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const user = users[0];
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Ajouter les crédits
    await pool.query("UPDATE users SET credit = credit + ? WHERE email = ?", [
      amount,
      email,
    ]);

    // Retourner la réponse avec les crédits mis à jour
    const [updatedUser] = await pool.query(
      "SELECT credit FROM users WHERE email = ?",
      [email]
    );

    res.status(200).json({
      message: "Crédits ajoutés avec succès.",
      credit: updatedUser[0].credit,
    });
  } catch (error) {
    console.error("Error adding credit:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout des crédits." });
  }
}
