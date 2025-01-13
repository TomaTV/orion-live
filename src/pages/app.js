import { useState, useEffect } from "react";
import Logo from "@/components/app/Logo";
import SearchBar from "@/components/app/SearchBar";
import Login from "@/components/app/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ici on vérifiera le token d'authentification
    // Pour l'instant, simulation avec localStorage
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {/* Ajouter un loader ici */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Logo />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <SearchBar />
      </div>
    </div>
  );
}
