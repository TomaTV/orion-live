/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} - true si l'email est valide
 */
export const validateEmail = (email) => {
  if (typeof email !== "string") return false;

  // Expression régulière pour validation basique
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicRegex.test(email)) return false;

  // Validation plus poussée
  const [localPart, domain] = email.split("@");

  // Vérification de la longueur
  if (email.length > 254) return false;
  if (localPart.length > 64) return false;
  if (domain.length > 255) return false;

  // Vérification des caractères valides dans la partie locale
  const validLocalRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
  if (!validLocalRegex.test(localPart)) return false;

  // Vérification du domaine
  const validDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!validDomainRegex.test(domain)) return false;

  // Vérifications supplémentaires
  if (localPart.startsWith(".") || localPart.endsWith(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  if (localPart.includes("..") || domain.includes("..")) return false;

  return true;
};

/**
 * Valide un nom d'utilisateur
 * @param {string} username - Nom d'utilisateur à valider
 * @returns {Object} - Résultat de la validation
 */
export const validateUsername = (username) => {
  const results = {
    isValid: false,
    errors: [],
  };

  if (typeof username !== "string") {
    results.errors.push(
      "Le nom d'utilisateur doit être une chaîne de caractères"
    );
    return results;
  }

  // Vérification de la longueur
  if (username.length < 3) {
    results.errors.push(
      "Le nom d'utilisateur doit contenir au moins 3 caractères"
    );
  }
  if (username.length > 30) {
    results.errors.push(
      "Le nom d'utilisateur ne doit pas dépasser 30 caractères"
    );
  }

  // Vérification des caractères autorisés
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    results.errors.push(
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, points, tirets et underscores"
    );
  }

  // Vérification des séquences invalides
  if (
    username.includes("..") ||
    username.includes("__") ||
    username.includes("--")
  ) {
    results.errors.push(
      "Le nom d'utilisateur ne peut pas contenir de caractères spéciaux consécutifs"
    );
  }

  // Vérification du début et de la fin
  if (/^[._-]/.test(username) || /[._-]$/.test(username)) {
    results.errors.push(
      "Le nom d'utilisateur ne peut pas commencer ou finir par un caractère spécial"
    );
  }

  results.isValid = results.errors.length === 0;
  return results;
};

/**
 * Valide une date
 * @param {string|Date} date - Date à valider
 * @returns {boolean} - true si la date est valide
 */
export const validateDate = (date) => {
  if (!date) return false;

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return false;

  // Vérifie si la date n'est pas dans le futur
  if (parsed > new Date()) return false;

  // Vérifie si la date n'est pas trop ancienne (par exemple avant 1900)
  if (parsed.getFullYear() < 1900) return false;

  return true;
};

/**
 * Nettoie et valide une URL
 * @param {string} url - URL à valider
 * @returns {Object} - Résultat de la validation et l'URL nettoyée
 */
export const validateURL = (url) => {
  const results = {
    isValid: false,
    cleanURL: "",
    errors: [],
  };

  if (typeof url !== "string") {
    results.errors.push("L'URL doit être une chaîne de caractères");
    return results;
  }

  try {
    // Nettoyage basique
    const trimmedURL = url.trim().toLowerCase();

    // Tentative de parsing
    const parsedURL = new URL(trimmedURL);

    // Vérifications de sécurité
    if (!["http:", "https:"].includes(parsedURL.protocol)) {
      results.errors.push("Protocole non autorisé");
      return results;
    }

    results.isValid = true;
    results.cleanURL = parsedURL.toString();
  } catch (error) {
    results.errors.push("URL invalide");
  }

  return results;
};
