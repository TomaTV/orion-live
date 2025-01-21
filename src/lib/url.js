export function resolveUrl(path) {
  // Vérifier si l'on est côté client
  if (typeof window !== "undefined") {
    // Les URL relatives fonctionnent côté client
    return path;
  }

  // Côté serveur : construire une URL absolue
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return `${baseUrl}${path}`;
}
