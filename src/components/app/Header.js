import withAuth from "../../components/hooks/withAuth";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

function HeaderApp() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    // Charger les informations utilisateur (crédits) depuis une API
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users/info");
        const data = await response.json();
        if (response.ok) {
          setCredits(data.credits);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="#hero" className="flex items-center gap-x-3">
              <div className="relative">
                <Image
                  src="/img/logo.png"
                  alt="Logo Orion"
                  width={40}
                  height={40}
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-white">Orion</span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Crédit */}
            <span className="text-white text-sm font-medium">
              Crédits : {credits}
            </span>

            {/* Light/Dark Mode Button */}
            <button
              onClick={toggleDarkMode}
              className="text-white px-3 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Profile Picture */}
            <Image
              src="/img/logo.png"
              alt="Photo de profil"
              width={40}
              height={40}
            />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default withAuth(HeaderApp);
