export function validateUrl(url) {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).toString();
  } catch (error) {
    throw new Error("URL invalide");
  }
}

export function formatError(error, source) {
  return {
    error: `Une erreur est survenue lors de l'analyse${source ? ` ${source}` : ""}.`,
    details: error.message,
  };
}

export function sanitizeResponse(data) {
  // Supprime les données confidentielles ou inutiles
  const sanitized = { ...data };
  delete sanitized.raw_data;
  return sanitized;
}