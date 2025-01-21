const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Chemin du dossier de backup
const backupDir = path.join(__dirname, '../database/backups');

// Création du backup
async function backup() {
  const date = new Date().toISOString().split('T')[0];
  const filename = `backup-${date}.sql`;
  const filePath = path.join(backupDir, filename);

  // Commande mysqldump
  const command = `mysqldump -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${filePath}`;

  exec(command, (error) => {
    if (error) {
      console.error('Erreur backup:', error);
      return;
    }
    console.log('Backup créé avec succès:', filename);
  });
}

// Exécution
backup();