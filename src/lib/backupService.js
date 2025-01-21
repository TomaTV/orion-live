// src/lib/backupService.js
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function performBackup() {
  try {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const backupFileName = `backup-${timestamp}.sql`;
    const backupPath = path.join(
      process.cwd(),
      "database",
      "backups",
      backupFileName
    );

    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    const mysqldump = `mysqldump -h ${DB_HOST} -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > "${backupPath}"`;

    await execAsync(mysqldump);

    // Garder seulement les 7 derniers backups
    const backupDir = path.join(process.cwd(), "database", "backups");
    const files = fs.readdirSync(backupDir);

    if (files.length > 7) {
      const sortedFiles = files
        .map((file) => ({
          name: file,
          time: fs.statSync(path.join(backupDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      // Supprimer les backups les plus anciens
      sortedFiles.slice(7).forEach((file) => {
        fs.unlinkSync(path.join(backupDir, file.name));
      });
    }

    return { success: true, file: backupFileName };
  } catch (error) {
    console.error("Backup error:", error);
    return { success: false, error: error.message };
  }
}
