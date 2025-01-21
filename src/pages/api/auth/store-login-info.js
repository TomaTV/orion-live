import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import pool from "../../../lib/db";
import crypto from "crypto";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    let clientIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";
    if (clientIp === "127.0.0.1" || clientIp === "::1") {
      clientIp = "::ffff:127.0.0.1";
    }

    const userAgent = req.headers["user-agent"] || "unknown";
    const deviceId = crypto
      .createHash("sha256")
      .update(userAgent)
      .digest("hex");

    // Stocker les informations dans la table temporaire
    await pool.query(
      `INSERT INTO login_info_temp (
        ip_address,
        user_agent,
        created_at,
        device_id
      ) VALUES (?, ?, NOW(), ?)`,
      [clientIp, userAgent, deviceId]
    );

    res.status(200).json({ message: "Info stored" });
  } catch (error) {
    console.error("Error storing login info:", error);
    res.status(500).json({ message: "Error" });
  }
}
