import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;
  const userAgent = req.headers["user-agent"];
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    await pool.query(
      `UPDATE users 
       SET last_user_agent = ?,
           last_ip = ?
       WHERE email = ?`,
      [userAgent, clientIp, email]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Update user info error:", error);
    res.status(500).json({ success: false });
  }
}
