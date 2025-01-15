import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { LogOut } from "lucide-react"; // Importer l'icône Lucide

function HeaderApp() {
  const [credits, setCredits] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users/info");
        const data = await response.json();
        if (response.ok) {
          setCredits(data.credits);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des crédits:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-x-2">
          <div className="relative">
            <Image
              src="/img/logo.png"
              alt="Logo Orion"
              width={40}
              height={40}
              priority
            />
          </div>
          <span className="text-2xl font-bold text-white font-spaceg">
            Orion
          </span>
        </div>

        {/* Section droite : Crédits + Déconnexion */}
        <div className="flex items-center space-x-4">
          {/* Crédits */}
          <span className="text-white text-sm font-medium">
            Crédits : <span className="font-bold text-blue-400">{credits}</span>
          </span>

          {/* Icône de déconnexion */}
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-red-600 transition-colors"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default HeaderApp;
