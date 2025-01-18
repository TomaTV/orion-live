import pool from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userAgent } = req.body;
    const clientIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";

    // Stocker les infos temporairement
    await pool.query(
      `INSERT INTO security_logs 
       (type, email, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        "PRE_GOOGLE_LOGIN",
        "pending_google_auth",
        clientIp,
        userAgent,
        "PENDING",
      ]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Store Google info error:", error);
    res.status(500).json({ message: "Error storing info" });
  }
}
