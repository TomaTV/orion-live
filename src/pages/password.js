import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import LoginBackground from "../components/ui/LoginBackground";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) return "L'email est requis"; // Vérifie si le champ est vide
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Format d'email invalide";
    return ""; // Pas d'erreur
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de l'email avant de continuer
    const emailError = validateEmail();
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        // Succès : redirection
        localStorage.setItem("resetEmail", email);
        router.push("/password-reset");
      } else {
        // Échec : afficher l'erreur retournée par l'API
        setError(data.error || "Une erreur est survenue");
      }
    } catch (error) {
      // Gestion des erreurs réseau
      console.error("Erreur réseau:", error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-orion-dark-bg">
      <LoginBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orion-dark-bg opacity-90" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4 sm:px-6"
      >
        <div className="backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-white/10">
          <div className="text-center mb-8">
            <h1
              className="font-inter font-bold text-4xl tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(160deg, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(113, 113, 122, 0.9) 75%, #71717A 100%)",
              }}
            >
              Mot de passe oublié
            </h1>
            <p className="mt-2 text-gray-400">
              Réinitialisez votre mot de passe
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-lg bg-black/30 border text-white placeholder-gray-500 transition-all duration-200 outline-none ${
                  error
                    ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50"
                    : "border-white/10 focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                }`}
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>

            <div className="relative overflow-hidden rounded-full">
              <motion.button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-2 px-8 py-4 text-white border-t border-l border-r border-white/20 rounded-full transition-all duration-300 hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute bottom-0 left-0 right-0 h-[2px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orion-nebula/40 to-transparent" />
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orion-nebula to-transparent" />
                </div>

                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Envoyer le lien de réinitialisation</span>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link
                href="/login"
                className="text-orion-nebula hover:text-orion-light-blue transition-colors"
              >
                Se connecter
              </Link>
              {" • "}
              <Link
                href="/"
                className="text-orion-nebula hover:text-orion-light-blue transition-colors"
              >
                Retour à l&apos;accueil
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
