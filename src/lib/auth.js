import { signOut as nextAuthSignOut } from "next-auth/react";

export async function handleLogout(router) {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Erreur API logout: ${res.status}`);
    }

    await nextAuthSignOut({ redirect: false });

    router.push("/login");
  } catch (error) {
    console.error("Erreur complète handleLogout:", error);
    router.push("/login");
  }
}
