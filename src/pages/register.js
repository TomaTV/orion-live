import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Loader2, UserPlus } from "lucide-react";
import LoginBackground from "../components/ui/LoginBackground";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const MAX_ATTEMPTS = 5;
  const ATTEMPT_RESET_TIME = 30 * 60 * 1000; // 30 minutes en millisecondes

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation du mot de passe - une erreur à la fois
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit faire au moins 8 caractères";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins une majuscule";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins une minuscule";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un chiffre";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins un caractère spécial";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier le nombre de tentatives
    if (attemptCount >= MAX_ATTEMPTS) {
      setErrors({
        general: `Trop de tentatives. Veuillez réessayer dans ${Math.ceil(ATTEMPT_RESET_TIME / 60000)} minutes.`,
      });
      return;
    }

    if (!validateForm()) {
      setAttemptCount((prev) => prev + 1);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        setErrors({ general: data.message });
        setAttemptCount((prev) => prev + 1);

        // Si max tentatives atteint, programmer la réinitialisation
        if (attemptCount + 1 >= MAX_ATTEMPTS) {
          setTimeout(() => {
            setAttemptCount(0);
          }, ATTEMPT_RESET_TIME);
        }
      }
    } catch (error) {
      setErrors({ general: "Une erreur est survenue" });
      setAttemptCount((prev) => prev + 1);
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
              Créer un compte
            </h1>
            <p className="mt-2 text-gray-400">
              Rejoignez l&apos;aventure Orion
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                placeholder="vous@exemple.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orion-nebula text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Créer un compte</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Déjà un compte ?{" "}
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
