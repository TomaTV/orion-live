export class RateLimiter {
  constructor(options = {}) {
    this.interval = options.interval || 60000; // 1 minute par défaut
    this.maxRequests = options.maxRequests || 10;
    this.cache = new Map();
  }

  async check(identifier) {
    const now = Date.now();
    const userRequests = this.cache.get(identifier) || [];

    // Nettoyer les anciennes requêtes
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.interval
    );

    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = validRequests[0];
      const timeToWait = this.interval - (now - oldestRequest);
      throw new Error(`RATE_LIMIT_EXCEEDED:${Math.ceil(timeToWait / 1000)}`);
    }

    // Ajouter la nouvelle requête
    validRequests.push(now);
    this.cache.set(identifier, validRequests);

    // Nettoyage périodique du cache
    if (Math.random() < 0.01) { // 1% de chance de nettoyage à chaque requête
      this.cleanup(now);
    }

    return true;
  }

  cleanup(now) {
    for (const [key, timestamps] of this.cache.entries()) {
      const validTimestamps = timestamps.filter(
        timestamp => now - timestamp < this.interval
      );
      if (validTimestamps.length === 0) {
        this.cache.delete(key);
      } else {
        this.cache.set(key, validTimestamps);
      }
    }
  }
}

// Middleware de rate limiting
export const rateLimit = (options = {}) => {
  const limiter = new RateLimiter(options);

  return {
    check: async (res, limit, identifier) => {
      try {
        await limiter.check(identifier);
        return true;
      } catch (error) {
        const [code, waitTime] = error.message.split(':');
        if (code === 'RATE_LIMIT_EXCEEDED') {
          res.setHeader('Retry-After', waitTime);
          res.setHeader('X-RateLimit-Reset', Date.now() + parseInt(waitTime) * 1000);
          return false;
        }
        throw error;
      }
    }
  };
};