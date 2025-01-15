import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Home, LogIn, AlertCircle, Loader2 } from "lucide-react";
import LoginBackground from "../components/ui/LoginBackground";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!credentials.email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!credentials.password) {
      newErrors.password = "Le mot de passe est requis";
    }

    setErrors({ ...errors, ...newErrors });
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({ ...errors, general: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/app");
      } else {
        setErrors({
          ...errors,
          general:
            data.message || "Une erreur est survenue lors de la connexion",
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        general: "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({ ...errors, general: "" });

    try {
      setErrors({
        ...errors,
        general: "La connexion avec Google n'est pas encore disponible",
      });
    } catch (error) {
      setErrors({
        ...errors,
        general: "Une erreur est survenue avec Google",
      });
    } finally {
      setGoogleLoading(false);
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
              Connexion
            </h1>
            <p className="mt-2 text-gray-400">Accédez à votre espace</p>
          </div>

          {router.query.registered && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-400">
                Compte créé avec succès ! Vous pouvez maintenant vous connecter.
              </p>
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/10 rounded-lg bg-white text-gray-800 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>Continuer avec Google</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-orion-dark-bg text-gray-400">Ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-lg bg-black/30 border text-white placeholder-gray-500 transition-all duration-200 outline-none ${
                  errors.email
                    ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50"
                    : "border-white/10 focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                }`}
                placeholder="vous@exemple.com"
                value={credentials.email}
                onChange={(e) => {
                  setCredentials({ ...credentials, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                autoComplete="current-password"
                className={`w-full px-4 py-3 rounded-lg bg-black/30 border text-white placeholder-gray-500 transition-all duration-200 outline-none ${
                  errors.password
                    ? "border-red-500/50 focus:ring-2 focus:ring-red-500/50"
                    : "border-white/10 focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                }`}
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({ ...credentials, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: "" });
                }}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orion-nebula focus:ring-orion-nebula rounded bg-black/30 border-white/10"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-300"
                >
                  Se souvenir de moi
                </label>
              </div>

              <Link
                href="/password"
                className="text-sm text-orion-nebula hover:text-orion-light-blue transition-colors"
              >
                Mot de passe oublié ?
              </Link>
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
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Se connecter</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-orion-nebula hover:text-orion-light-blue transition-colors"
              >
                Créer un compte
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
