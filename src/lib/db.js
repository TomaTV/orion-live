import mysql from "mysql2/promise";

// Connexion à la base de données avec gestion des erreurs
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost", // Utilisation des variables d'environnement pour plus de flexibilité
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "orion_live",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
