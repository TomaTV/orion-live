import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execAsync = promisify(exec);

export async function createBackup() {
  try {
    // Créer le dossier de backup s'il n'existe pas
    const backupDir = path.join(process.cwd(), "database/backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Nom du fichier avec la date
    const date = new Date().toISOString().split("T")[0];
    const filename = `backup-${date}.sql`;
    const filePath = path.join(backupDir, filename);

    // Chemin vers mysqldump sur Windows (XAMPP)
    const mysqldumpPath = '"C:\\xampp\\mysql\\bin\\mysqldump.exe"';

    // Commande de backup
    const command = `${mysqldumpPath} -h ${process.env.DB_HOST} -u ${process.env.DB_USER} ${process.env.DB_PASSWORD ? `-p${process.env.DB_PASSWORD}` : ""} ${process.env.DB_NAME} > "${filePath}"`;

    // Exécuter la commande
    await execAsync(command);
    console.log("Backup créé avec succès:", filename);
  } catch (error) {
    console.error("Erreur lors du backup:", error);
  }
}