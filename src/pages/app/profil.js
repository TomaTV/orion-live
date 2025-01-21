/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Camera, AlertTriangle, CheckCircle2, Loader2, Lock } from "lucide-react";
import HeaderApp from "@/components/app/Header";
import Link from "next/link";

const ProfilePage = () => {
  const { data: session, status } = useSession({ required: true });
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
        const response = await fetch("/api/users/update-settings");
        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            avatarUrl: data.avatarUrl || "",
          });
        } else {
          setMessage({
            type: "error",
            text: "Erreur lors du chargement des données."
          });
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Impossible de charger le profil."
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Profil mis à jour avec succès !"
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Erreur lors de la mise à jour."
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur de connexion au serveur."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-orion-dark-bg">
        <HeaderApp />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orion-nebula" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-orion-dark-bg">
      <HeaderApp />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Retour et Titre */}
        <div className="mb-8">
          <Link
            href="/app"
            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            <span>Retour à l&apos;application</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Paramètres du profil
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez vos informations personnelles et vos préférences.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-orion-nebula bg-orion-nebula/5 rounded-md">
                Informations personnelles
              </button>
              <Link
                href="/app/profil/security"
                className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md flex items-center justify-between group"
              >
                Sécurité
                <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/app/profil/notifications"
                className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md flex items-center justify-between group"
              >
                Notifications
                <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Avatar Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Photo de profil
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5">
                    <img
                      src={formData.avatarUrl || "/img/profil.jpg"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/profil.jpg";
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-orion-nebula hover:bg-orion-purple shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL de l&apos;avatar
                  </label>
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-1 w-full px-4 py-2 rounded-md 
                             bg-white dark:bg-white/5 
                             text-gray-900 dark:text-white 
                             border border-gray-200 dark:border-white/10
                             focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG ou GIF. 1MB max.
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Informations personnelles
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mettez à jour vos informations personnelles.
                  </p>
                </div>
                <Lock className="w-5 h-5 text-gray-400" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Votre prénom"
                      className="w-full px-4 py-2 rounded-md 
                               bg-white dark:bg-white/5 
                               text-gray-900 dark:text-white 
                               border border-gray-200 dark:border-white/10
                               focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom"
                      className="w-full px-4 py-2 rounded-md 
                               bg-white dark:bg-white/5 
                               text-gray-900 dark:text-white 
                               border border-gray-200 dark:border-white/10
                               focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Message Display */}
                {message && (
                  <div className={`p-4 rounded-md ${
                    message.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10' 
                      : 'bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      {message.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                      )}
                      <p className={`text-sm ${
                        message.type === 'success' 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-red-700 dark:text-red-400'
                      }`}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-md text-white font-medium
                           bg-orion-nebula hover:bg-orion-purple 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSubmitting ? "Mise à jour..." : "Sauvegarder"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;