import crypto from 'crypto';

/**
 * Génère un code sécurisé de la longueur spécifiée
 * @param {number} length - Longueur du code
 * @param {boolean} numbersOnly - Si true, génère uniquement des chiffres
 * @returns {string} - Code généré
 */
export const generateSecureCode = (length = 6, numbersOnly = true) => {
  if (numbersOnly) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const randomBuffer = crypto.randomBytes(4);
    const randomNumber = randomBuffer.readUInt32BE(0);
    return (Math.floor(randomNumber / (0xffffffff / (max - min + 1))) + min).toString();
  }

  const charset = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclus 0,1,I,O pour éviter la confusion
  const randomBytes = crypto.randomBytes(length);
  const result = new Array(length);
  const maxByte = 256 - (256 % charset.length);

  for (let i = 0; i < length; i++) {
    let randomByte;
    do {
      randomByte = randomBytes[i];
    } while (randomByte >= maxByte);
    result[i] = charset[randomByte % charset.length];
  }

  return result.join('');
};

/**
 * Vérifie si un mot de passe respecte les critères de sécurité
 * @param {string} password - Mot de passe à vérifier
 * @returns {Object} - Résultat de la validation
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 128;
  
  const results = {
    isValid: false,
    errors: [],
    strength: 0,
  };

  // Vérification de la longueur
  if (password.length < minLength) {
    results.errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
  }
  if (password.length > maxLength) {
    results.errors.push(`Le mot de passe ne doit pas dépasser ${maxLength} caractères`);
  }

  // Vérification des critères
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calcul du score
  results.strength += hasUpperCase ? 25 : 0;
  results.strength += hasLowerCase ? 25 : 0;
  results.strength += hasNumbers ? 25 : 0;
  results.strength += hasSpecialChars ? 25 : 0;

  // Ajout des erreurs
  if (!hasUpperCase) results.errors.push("Doit contenir au moins une majuscule");
  if (!hasLowerCase) results.errors.push("Doit contenir au moins une minuscule");
  if (!hasNumbers) results.errors.push("Doit contenir au moins un chiffre");
  if (!hasSpecialChars) results.errors.push("Doit contenir au moins un caractère spécial");

  // Validation finale
  results.isValid = results.errors.length === 0;

  return results;
};

/**
 * Compare deux hashs de manière sécurisée (timing-safe)
 * @param {string} a - Premier hash
 * @param {string} b - Second hash
 * @returns {boolean} - true si les hashs sont identiques
 */
export const secureCompare = (a, b) => {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }
  
  const buff1 = Buffer.from(a);
  const buff2 = Buffer.from(b);
  
  try {
    return crypto.timingSafeEqual(buff1, buff2);
  } catch (error) {
    return false;
  }
};

/**
 * Génère un token sécurisé pour les sessions
 * @returns {string} - Token généré
 */
export const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};