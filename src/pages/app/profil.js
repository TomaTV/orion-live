/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import HeaderApp from "@/components/app/Header";
import Link from "next/link";

const ProfilePage = () => {
  const { data: session, status } = useSession({
    required: true,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    avatarUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;

      setIsLoading(true);
      try {
        const response = await fetch("/api/users/update-settings", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            avatarUrl: data.avatarUrl || "",
          });
        } else {
          setMessage("Erreur lors du chargement des données.");
        }
      } catch (error) {
        console.error("Erreur :", error);
        setMessage("Impossible de charger le profil.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users/update-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Profil mis à jour avec succès !");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("Erreur de connexion au serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-orion-dark-bg">
        <HeaderApp />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orion-nebula"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-orion-dark-bg">
      <HeaderApp />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link
            href="/app"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l&apos;application
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-2 font-spaceg">
            Mon Profil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Personnalisez vos informations personnelles et votre avatar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-white/5 rounded-xl p-6 shadow-md max-w-md mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
                className="mt-1 block w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-orion-nebula focus:border-orion-nebula"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                className="mt-1 block w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-orion-nebula focus:border-orion-nebula"
                required
              />
            </div>

            <div>
              <label
                htmlFor="avatarUrl"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                URL de l&apos;avatar
              </label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1 block w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-orion-nebula focus:border-orion-nebula"
              />
            </div>

            <div>
              {formData.avatarUrl && formData.avatarUrl.startsWith("http") ? (
                <div className="flex justify-center mb-4">
                  <img
                    src={formData.avatarUrl}
                    alt="Aperçu de l'avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/profil.jpg";
                    }}
                    className="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Veuillez entrer une URL valide pour l&apos;aperçu de
                  l&apos;avatar.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative w-full py-3 px-6 rounded-lg text-white bg-orion-nebula hover:bg-orion-nebula/90 focus:ring-2 focus:ring-orion-nebula focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group`}
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          {message && (
            <div className="mt-4">
              {message.includes("succès") ? (
                <p className="text-center text-green-500">{message}</p>
              ) : (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-red-400">{message}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
