import { handleLogout as handleAuthLogout } from "@/lib/securityMonitoring";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { LogOut, Moon, Sun, Plus, Sparkles, User } from "lucide-react";
import Link from "next/link";

function HeaderApp() {
  const [credits, setCredits] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(null);
  const router = useRouter();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Charger les infos utilisateur (crédits et préférences)
        const response = await fetch("/api/users/info");
        const data = await response.json();
        if (response.ok) {
          setCredits(data.credits);
          setAvatar(data.avatar_url);

          // Si l'utilisateur a une préférence de thème en base, l'utiliser
          if (data.theme) {
            setIsDark(data.theme === "dark");
            localStorage.setItem("theme", data.theme);
            document.documentElement.classList.toggle(
              "dark",
              data.theme === "dark"
            );
          } else {
            // Sinon, utiliser le localStorage ou le thème par défaut
            const localTheme = localStorage.getItem("theme") || "dark";
            setIsDark(localTheme === "dark");
            document.documentElement.classList.toggle(
              "dark",
              localTheme === "dark"
            );
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // En cas d'erreur, utiliser le localStorage ou le thème par défaut
        const localTheme = localStorage.getItem("theme") || "dark";
        setIsDark(localTheme === "dark");
        document.documentElement.classList.toggle(
          "dark",
          localTheme === "dark"
        );
      }
    };

    loadInitialData();

    // Cleanup des timers si le composant est démonté
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (lockTimer) {
        clearTimeout(lockTimer);
      }
    };
  }, [lockTimer]);

  const updateThemeInDB = async (themeName) => {
    // Annuler le timeout précédent si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Créer un nouveau timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/users/update-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: themeName }),
        });
      } catch (error) {
        console.error("Erreur de mise à jour en base:", error);
      }
    }, 1000); // 1 seconde de délai
  };

  const toggleTheme = async () => {
    if (isUpdating || isLocked) return;

    if (changeCount >= 5) {
      setIsLocked(true);
      setLockTimer(setTimeout(() => setIsLocked(false), 60000));
      return;
    }

    setIsUpdating(true);
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    try {
      await fetch("/api/users/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme ? "dark" : "light" }),
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du thème:", error);
    } finally {
      setIsUpdating(false);
      setChangeCount((prev) => prev + 1);
    }
  };

  const handleLogout = async () => {
    await handleAuthLogout(router);
  };

  return (
    <nav className="bg-gray-50/95 dark:bg-black/30 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-center h-16 px-6">
        {/* Logo */}
        <div className="flex items-center gap-x-3">
          <div className="relative">
            <img
              src={isDark ? "/img/logo.png" : "/img/logo-black.png"}
              alt="Logo Orion"
              width={40}
              height={40}
              priority
              className="rounded-xl"
            />
          </div>
          <span className="text-2xl font-bold text-gray-800 dark:text-white font-spaceg">
            Orion
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white dark:bg-white/5 rounded-lg shadow-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-700 dark:text-white" />
              <span className="text-gray-700 dark:text-white text-sm font-medium">
                {credits} crédits
              </span>
            </div>
            <Link
              href="/app/pricing"
              className="p-2 bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm"
            >
              <Plus size={20} className="text-gray-600 dark:text-white" />
            </Link>
          </div>

          <Link
            href="/app/profil"
            className="w-8 h-8 bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm relative overflow-hidden flex items-center justify-center"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <User size={20} className="text-gray-600 dark:text-white" />
            )}
          </Link>

          <button
            onClick={toggleTheme}
            disabled={isUpdating || isLocked}
            className={`p-2 text-gray-600 dark:text-white hover:bg-white dark:hover:bg-white/5 rounded-lg ${
              isUpdating || isLocked ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              isLocked
                ? "Attendez avant de changer le thème."
                : "Changer le thème"
            }
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 dark:text-white hover:bg-white dark:hover:bg-white/5 rounded-lg"
            title="Se déconnecter"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default HeaderApp;
