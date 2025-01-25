import { useEffect } from "react";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { ThemeProvider } from "../context/ThemeContext";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Auth check
    if (router.pathname.startsWith("/app")) {
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";
      if (!isAuthenticated) {
        router.push("/login");
      }
    }

    // Theme init
    const theme = localStorage.getItem("theme");
    if (!theme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }

    // Remove visibility: hidden once theme is applied
    document.documentElement.classList.remove("invisible");
  }, [router, router.pathname]);

  // Prevent FOUC
  useEffect(() => {
    document.documentElement.classList.add("theme-loaded");
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
