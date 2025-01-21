import { useEffect } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { createBackup } from "@/lib/backup";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Backup automatique à 3h du matin
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      const now = new Date();
      const nextBackup = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        3, // 3h
        0  // 0min
      );
      
      // Temps jusqu'au prochain backup
      let timeUntilBackup = nextBackup.getTime() - now.getTime();
      
      // Premier backup
      const timer = setTimeout(() => {
        createBackup();
        
        // Programmer les backups suivants toutes les 24h
        setInterval(() => {
          createBackup();
        }, 24 * 60 * 60 * 1000);
      }, timeUntilBackup);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Vérification de l'authentification pour les routes /app
    if (router.pathname.startsWith("/app")) {
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
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

  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;