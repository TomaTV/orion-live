import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { code } = req.body;

  try {
    const [promos] = await pool.query(
      `SELECT * FROM promo_codes 
       WHERE code = ? 
       AND (valid_until IS NULL OR valid_until > NOW())
       AND (usage_limit IS NULL OR times_used < usage_limit)`,
      [code]
    );

    if (!promos.length) {
      return res.status(404).json({ message: "Code promo invalide ou expiré" });
    }

    return res.status(200).json({
      discount_percentage: promos[0].discount_percentage
    });

  } catch (error) {
    console.error("Erreur lors de la vérification du code promo:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}
