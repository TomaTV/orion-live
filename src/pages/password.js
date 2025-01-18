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
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) return "L'email est requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Format d'email invalide";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail();
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    setIsGoogleAccount(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("resetEmail", email);
        setSuccess(data.message);
        if (!data.isGoogleAccount) {
          setTimeout(() => {
            router.push("/password-reset");
          }, 2000);
        }
      } else if (data.isGoogleAccount) {
        setIsGoogleAccount(true);
      } else {
        setError(data.message || "Une erreur est survenue");
      }
    } catch (error) {
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

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {isGoogleAccount ? (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 bg-red-500/10 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-red-400 font-semibold mb-1">
                    Compte Google détecté
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Ce compte utilise la connexion Google. Vous ne pouvez pas
                    réinitialiser le mot de passe.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Retourner à la connexion
                  </Link>
                </div>
              </div>
            </div>
          ) : (
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

              <div className="relative overflow-hidden rounded-lg">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 text-white bg-orion-nebula hover:bg-orion-nebula/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Réinitialiser le mot de passe"
                  )}
                </button>
              </div>
            </form>
          )}

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
