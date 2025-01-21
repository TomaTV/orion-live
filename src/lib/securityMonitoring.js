import { signOut as nextAuthSignOut } from "next-auth/react";
import crypto from "crypto";
import { resolveUrl } from "@/lib/url";

/**
 * Fonction pour envoyer une alerte de sécurité via l'API
 */
async function sendSecurityAlert(userId, type, data) {
  try {
    const url = resolveUrl("/api/auth/security-alert");
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        type,
        data,
      }),
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'alerte:", error);
  }
}

/**
 * Génère un code sécurisé de la longueur spécifiée
 */
export const generateSecureCode = (length = 6, numbersOnly = true) => {
  if (numbersOnly) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    const randomBuffer = crypto.randomBytes(4);
    const randomNumber = randomBuffer.readUInt32BE(0);
    return (
      Math.floor(randomNumber / (0xffffffff / (max - min + 1))) + min
    ).toString();
  }

  const charset = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
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

  return result.join("");
};

/**
 * Gestion de la déconnexion
 */
export async function handleLogout(router) {
  try {
    const url = resolveUrl("/api/auth/logout");
    const res = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Erreur API logout: ${res.status}`);
    await nextAuthSignOut({ redirect: false });
    router.push("/login");
  } catch (error) {
    console.error("Erreur complète handleLogout:", error);
    router.push("/login");
  }
}

export const SecurityMonitoring = {
  async checkNewDevice({ userId, deviceId, userAgent, ip }) {
    try {
      const url = resolveUrl("/api/auth/check-device");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, deviceId, userAgent, ip }),
      });

      return response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du nouvel appareil:",
        error
      );
      throw error;
    }
  },

  async checkConcurrentSessions({ userId, deviceId, ip }) {
    try {
      const url = resolveUrl("/api/auth/check-sessions");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, deviceId, ip }),
      });

      const data = await response.json();
      return data.hasConcurrentSessions;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification des sessions concurrentes:",
        error
      );
      throw error;
    }
  },

  async checkIpChange({ userId, newIp }) {
    try {
      const url = resolveUrl("/api/auth/check-ip");
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newIp }),
      });
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du changement d'IP:",
        error
      );
      throw error;
    }
  },

  async checkLoginPattern({ userId, email, ip, deviceId, userAgent }) {
    try {
      const url = resolveUrl("/api/auth/check-security");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email,
          ip,
          deviceId,
          userAgent,
        }),
      });

      const data = await response.json();
      return data.alerts;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification des patterns de sécurité:",
        error
      );
      throw error;
    }
  },
};
