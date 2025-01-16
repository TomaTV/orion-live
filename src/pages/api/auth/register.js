import bcrypt from "bcryptjs";
import pool from "../../../lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { validateEmail } from "@/lib/validation";
import { validatePassword } from "@/lib/security";

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 heure
  maxRequests: 5 // 5 tentatives par heure
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    // Vérification du rate limit
    try {
      await limiter.check(clientIp);
    } catch (error) {
      return res.status(429).json({ 
        message: "Trop de tentatives d'inscription. Veuillez réessayer plus tard.",
        code: "RATE_LIMIT_EXCEEDED"
      });
    }

    const { email, password } = req.body;

    // Validation email
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email et mot de passe requis",
        code: "MISSING_FIELDS"
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: "Format d'email invalide",
        code: "INVALID_EMAIL"
      });
    }

    // Validation du mot de passe
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({ 
        message: "Le mot de passe ne respecte pas les critères de sécurité",
        errors: passwordCheck.errors,
        strength: passwordCheck.strength,
        code: "INVALID_PASSWORD"
      });
    }

    // Log de la tentative d'inscription
    await pool.query(
      `INSERT INTO security_logs (type, email, ip_address, user_agent, status)
       VALUES (?, ?, ?, ?, ?)`,
      ['REGISTER_ATTEMPT', email, clientIp, req.headers["user-agent"], 'PENDING']
    );

    // Vérification de l'email existant
    const [existingUsers] = await pool.query(
      "SELECT id, deleted_at FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      // Si le compte est supprimé, permettre la réinscription
      if (existingUsers[0].deleted_at) {
        await pool.query(
          "UPDATE users SET deleted_at = NULL WHERE email = ?",
          [email]
        );
        await pool.query(
          "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
          ['REACTIVATED', email, 'REGISTER_ATTEMPT']
        );
      } else {
        await pool.query(
          "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
          ['FAILED_EMAIL_EXISTS', email, 'REGISTER_ATTEMPT']
        );
        return res.status(400).json({ 
          message: "Cet email est déjà utilisé",
          code: "EMAIL_EXISTS"
        });
      }
    }

    // Hashage du mot de passe avec un coût plus élevé pour plus de sécurité
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création du compte dans une transaction
    await pool.query('START TRANSACTION');

    try {
      // Insertion de l'utilisateur
      const [result] = await pool.query(
        `INSERT INTO users (
          email, 
          password, 
          created_at,
          created_ip,
          created_user_agent
        ) VALUES (?, ?, NOW(), ?, ?)`,
        [email, hashedPassword, clientIp, req.headers["user-agent"]]
      );

      // Création des entrées dans les tables associées si nécessaire
      await pool.query(
        "INSERT INTO user_settings (user_id) VALUES (?)",
        [result.insertId]
      );

      await pool.query('COMMIT');

      // Log du succès
      await pool.query(
        "UPDATE security_logs SET status = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
        ['SUCCESS', email, 'REGISTER_ATTEMPT']
      );

      res.status(201).json({ 
        message: "Compte créé avec succès",
        code: "REGISTRATION_SUCCESS"
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error("Registration error:", error);
    
    // Log de l'erreur
    await pool.query(
      "UPDATE security_logs SET status = ?, error = ? WHERE email = ? AND type = ? ORDER BY created_at DESC LIMIT 1",
      ['FAILED_SERVER_ERROR', error.message, req.body.email, 'REGISTER_ATTEMPT']
    );

    res.status(500).json({ 
      message: "Erreur lors de la création du compte",
      code: "SERVER_ERROR"
    });
  }
}