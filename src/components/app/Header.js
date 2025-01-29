/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import {
  Search,
  LogOut,
  Moon,
  Sun,
  Plus,
  Sparkles,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import { useRouter } from "next/router";
import { handleLogout as handleAuthLogout } from "@/lib/securityMonitoring";

function HeaderApp({ onAnalyzeComplete }) {
  const [credits, setCredits] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(null);

  // États pour la SearchBar
  const [search, setSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const cachedData = localStorage.getItem("userProfile");
    if (cachedData) {
      const data = JSON.parse(cachedData);
      setCredits(data.credits);
      setAvatar(data.avatarUrl);
    }

    const loadInitialData = async () => {
      try {
        const response = await fetch("/api/users/info");
        const data = await response.json();
        if (response.ok) {
          setCredits(data.credits);
          setAvatar(data.avatarUrl);
          localStorage.setItem("userProfile", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadInitialData();

    return () => {
      if (lockTimer) {
        clearTimeout(lockTimer);
      }
    };
  }, [lockTimer]);

  // Fonctions pour la SearchBar
  const validateUrl = (urlString) => {
    if (!urlString.trim()) return { isValid: false, error: null };

    try {
      const url = new URL(
        !/^https?:\/\//i.test(urlString) ? `https://${urlString}` : urlString
      );

      if (
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.hostname === "0.0.0.0" ||
        url.hostname.startsWith("192.168.") ||
        url.hostname.startsWith("10.") ||
        url.hostname.startsWith("172.")
      ) {
        return {
          isValid: false,
          error: "Les URLs locales ne sont pas autorisées",
        };
      }

      if (!url.hostname.includes(".")) {
        return { isValid: false, error: "Le nom de domaine n'est pas valide" };
      }

      const parts = url.hostname.split(".");
      if (parts[parts.length - 1].length < 2) {
        return {
          isValid: false,
          error: "L'extension du domaine n'est pas valide",
        };
      }

      return { isValid: true, url: url.href };
    } catch (error) {
      return { isValid: false, error: "Format d'URL invalide" };
    }
  };

  const handleAnalyze = async () => {
    if (!search.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalyzeError(null);

    const validation = validateUrl(search.trim());
    if (!validation.isValid) {
      setAnalyzeError(validation.error);
      setIsAnalyzing(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validation.url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'analyse");
      }

      onAnalyzeComplete?.(data);
      setSearch("");
      setIsUrlValid(false);
    } catch (error) {
      setAnalyzeError(error.message);
      console.error("Error analyzing URL:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isUrlValid) {
      handleAnalyze();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    const validation = validateUrl(value);
    setIsUrlValid(validation.isValid);
    setAnalyzeError(validation.error);
  };

  const toggleTheme = async () => {
    if (isUpdating || isLocked) return;

    if (changeCount >= 5) {
      setIsLocked(true);
      setLockTimer(setTimeout(() => setIsLocked(false), 60000));
      return;
    }

    setIsUpdating(true);
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    try {
      await fetch("/api/users/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
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
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex gap-x-8 items-center">
          <Link href="/app" className="flex-shrink-0">
            <div className="relative flex items-center gap-x-3">
              <img
                src={theme === "dark" ? "/img/logo.png" : "/img/logo-black.png"}
                alt="Logo Orion"
                width={40}
                height={40}
                className="rounded-xl"
              />
              <span className="text-xl font-bold text-gray-800 dark:text-white font-spaceg">
                Orion
              </span>
            </div>
          </Link>

          {/* SearchBar */}
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                disabled={isAnalyzing}
                placeholder="Exemple : https://google.com"
                className={`w-96 bg-white dark:bg-white/5 rounded-lg shadow-sm px-10 py-2 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 
                  ${!search ? "" : analyzeError ? "ring-2 ring-red-500/50" : "ring-2 ring-orion-nebula/50"} 
                  ${isAnalyzing ? "opacity-75" : ""}`}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-700 dark:text-white" />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!isUrlValid || isAnalyzing}
              className={`px-4 py-2 bg-orion-nebula dark:bg-orion-nebula rounded-lg shadow-sm font-medium transition-all duration-200 text-white
                ${
                  isUrlValid && !isAnalyzing
                    ? "text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10"
                    : "text-gray-400 dark:text-gray-300 cursor-not-allowed"
                }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyse...
                </div>
              ) : (
                "Analyser"
              )}
            </button>
          </div>
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
              prefetch={false}
              className="p-2 bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm"
            >
              <Plus size={20} className="text-gray-600 dark:text-white" />
            </Link>
          </div>

          <Link
            href="/app/profil"
            className="w-9 h-9 bg-white dark:bg-white/5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm relative overflow-hidden flex items-center justify-center"
          >
            {avatar && avatar !== "" ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => (e.target.src = "/img/profil.jpg")}
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
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 dark:text-white hover:bg-white dark:hover:bg-white/5 rounded-lg hover:text-red-500"
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
