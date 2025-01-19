import { withAdmin } from "@/pages/api/admin/auth";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const [users] = await pool.query(
      "SELECT id, email, rank, created_at FROM users WHERE deleted_at IS NULL"
    );

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default withAdmin(handler);
