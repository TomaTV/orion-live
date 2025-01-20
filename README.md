# Orion 🚀  

**Orion** est une plateforme SaaS dédiée à l'analyse approfondie des sites web. Ce dépôt contient le code source de la landing page, conçue pour présenter les fonctionnalités et attirer les premiers utilisateurs. Ce projet est personnel et ne doit pas être copié, mais vous pouvez m'aider en contribuant.

## 🎯 Objectif  
La landing page permet de :  
- Présenter les fonctionnalités principales d'Orion.  
- Collecter les inscriptions et tester l'intérêt des utilisateurs.  
- Offrir un accès à une démo et un essai gratuit.  

## 📦 Installation

1. **Cloner le dépôt :**

    ```bash
    git clone https://github.com/TomaTV/Flukx-Studio.git
    ```

2. **Naviguer dans le répertoire du projet :**

    ```bash
    cd votre-repo
    ```

3. **Installer les dépendances :**

    ```bash
    npm install
    ```

4. **Configurer la base de données :**  
    N'oubliez pas d'importer le fichier `database/orion_live.sql` dans votre base de données. Vous pouvez utiliser un client SQL comme MySQL Workbench ou phpMyAdmin pour l'importer.

5. **Configurer les variables d'environnement :**  
    Modifiez le fichier `.env.example` pour définir les configurations appropriées pour votre environnement (base de données, clés API, etc.), puis renommez-le en `.env`.

6. **Lancer le serveur de développement :**

    ```bash
    npm run dev
    ```

Votre application devrait maintenant fonctionner sur [http://localhost:3000](http://localhost:3000).

## 🛠️ App

Orion propose des fonctionnalités avancées pour ses utilisateurs, notamment (pour l'instant) :

- **Crédit par utilisateur** : Chaque utilisateur bénéficie d'un crédit gratuit à l'inscription, utilisable pour tester les différentes fonctionnalités de la plateforme.
- **Connexion sécurisée** : Nous assurons une connexion sécurisée grâce à des protocoles de sécurité modernes (par exemple, OAuth, JWT).

## 💡 Contribuer

Nous accueillons les contributions ! Si vous souhaitez nous aider, veuillez créer un [problème](https://github.com/TomaTV/Orion-live/issues) ou soumettre une [pull request](https://github.com/TomaTV/Orion-live/pulls).
test2