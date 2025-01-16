import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Vérification de l'authentification pour les routes /app
    if (router.pathname.startsWith("/app")) {
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";
      if (!isAuthenticated) {
        router.push("/login");
      }
    }

    // Initialisation du thème
    const theme = localStorage.getItem("theme");
    if (!theme) {
      // Si pas de préférence, on met dark par défaut
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [router.pathname]);

  // On applique une classe pour éviter le flash de contenu
  useEffect(() => {
    document.documentElement.classList.add("theme-loaded");
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
