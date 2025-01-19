import { signOut as nextAuthSignOut } from "next-auth/react";

export async function handleLogout(router) {
  try {
    console.log('1. Début du processus de déconnexion');

    // 1. Déconnexion NextAuth en premier
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Erreur API logout: ${res.status}`);
    }

    // 2. Supprimer la session NextAuth
    await nextAuthSignOut({ redirect: false });

    // 3. Redirection
    router.push('/login');
  } catch (error) {
    console.error('Erreur complète handleLogout:', error);
    router.push('/login');
  }
}