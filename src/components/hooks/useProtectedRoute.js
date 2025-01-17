import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useProtectedRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié via l'API
        const response = await fetch("/api/users/info");

        if (response.ok) {
          localStorage.setItem("isAuthenticated", "true");
          if (router.pathname === "/login") {
            router.push("/app");
          }
        } else {
          localStorage.removeItem("isAuthenticated");
          if (!router.pathname.includes("/login")) {
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Erreur de vérification d'authentification:", error);
        localStorage.removeItem("isAuthenticated");
        if (!router.pathname.includes("/login")) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isLoading };
}
