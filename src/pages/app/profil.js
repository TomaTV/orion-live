/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Camera,
  Mail,
  Monitor,
  Shield,
  Smartphone,
  LogOut,
  FileText,
  Gift,
  Loader2,
  User,
  Bell,
} from "lucide-react";
import HeaderApp from "@/components/app/Header";
import Link from "next/link";

const tabs = [
  { id: "profile", label: "Profil", icon: User },
  { id: "security", label: "Sécurité", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const ProfilePage = () => {
  const { data: session, status } = useSession({ required: true });
  const [activeTab, setActiveTab] = useState("profile");
  // Devices state
  const [devices, setDevices] = useState([]);
  const [avatar, setAvatar] = useState(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    avatarUrl: "",
    email: "",
    createdAt: "",
  });

  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications state
  const [notificationsData, setNotificationsData] = useState({
    emailReports: true,
    emailPromotions: true,
    emailSecurity: true,
  });

  const titles = {
    profile: {
      title: "Paramètres du profil",
      description: "Gérez vos informations personnelles et vos préférences",
    },
    security: {
      title: "Paramètres de sécurité",
      description:
        "Gérez la sécurité de votre compte et vos appareils connectés",
    },
    notifications: {
      title: "Préférences de notification",
      description: "Gérez vos préférences de notification par email",
    },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleNotificationToggle = async (key) => {
    try {
      const updatedData = {
        ...notificationsData,
        [key]: !notificationsData[key],
      };

      const res = await fetch("/api/users/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notifications_report: updatedData.emailReports,
          notifications_offers: updatedData.emailPromotions,
          notifications_security: updatedData.emailSecurity,
        }),
      });

      if (res.ok) {
        setNotificationsData(updatedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users/info");
        if (response.ok) {
          const data = await response.json();
          setProfileData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            avatarUrl: data.avatarUrl || "",
            email: data.email || session?.user?.email || "",
            createdAt: data.createdAt || "",
          });
          setNotificationsData({
            emailReports: data.notifications_report ?? true,
            emailPromotions: data.notifications_offers ?? true,
            emailSecurity: data.notifications_security ?? true,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadUserDevices = async () => {
      try {
        const res = await fetch("/api/users/devices");
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération des appareils");
        }
        const devices = await res.json();
        setDevices(devices); // Met à jour ton état avec les appareils
      } catch (error) {
        console.error("Erreur de récupération des appareils :", error);
      }
    };

    if (session) {
      loadUserData();
      loadUserDevices();
    }
  }, [session]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/users/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          avatarUrl: profileData.avatarUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData((prev) => {
          const newData = {
            ...prev,
            firstName: data.settings.firstName || "",
            lastName: data.settings.lastName || "",
            avatarUrl: data.settings.avatarUrl || "",
          };
          // Update localStorage
          const cachedData = localStorage.getItem("userProfile");
          if (cachedData) {
            const cached = JSON.parse(cachedData);
            localStorage.setItem(
              "userProfile",
              JSON.stringify({
                ...cached,
                ...newData,
              })
            );
          }
          return newData;
        });
        setMessage({ type: "success", text: "Profil mis à jour avec succès" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.message || "Erreur lors de la mise à jour",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function Toggle({ enabled, onChange }) {
    return (
      <button
        type="button"
        className={`${enabled ? "bg-orion-nebula" : "bg-gray-200 dark:bg-white/10"}
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
                  border-2 border-transparent transition-colors duration-300 ease-in-out`}
        onClick={onChange}
      >
        <span
          className={`${enabled ? "translate-x-5" : "translate-x-0"}
                   pointer-events-none inline-block h-5 w-5 transform rounded-full
                   bg-white shadow transition-transform duration-300 ease-in-out`}
        />
      </button>
    );
  }

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Photo de profil
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-white/5">
                    <img
                      src={profileData.avatarUrl || "/img/profil.jpg"}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/img/profil.jpg";
                      }}
                    />
                  </div>
                  <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-orion-nebula hover:bg-orion-purple shadow-lg transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    URL de l&apos;avatar
                  </label>
                  <input
                    type="url"
                    value={profileData.avatarUrl}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        avatarUrl: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-4 py-2 rounded-md bg-white dark:bg-white/5 
                             text-gray-900 dark:text-white border border-gray-200 dark:border-white/10
                             focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-400" : "bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-400"}`}
                >
                  {message.text}
                </div>
              )}
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      placeholder="Votre prénom"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-white/5 
                               text-gray-900 dark:text-white border border-gray-200 dark:border-white/10
                               focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-white/5 
                               text-gray-900 dark:text-white border border-gray-200 dark:border-white/10
                               focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileData.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-white/5 
                               text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10
                               cursor-not-allowed"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-white font-medium
                             bg-orion-nebula hover:bg-orion-purple transition-colors"
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            {/* Password Change Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Changer le mot de passe
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Modifiez votre mot de passe pour sécuriser votre compte
                  </p>
                </div>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true);

                  try {
                    if (
                      !securityData.currentPassword ||
                      !securityData.newPassword ||
                      !securityData.confirmPassword
                    ) {
                      setMessage({
                        type: "error",
                        text: "Tous les champs sont requis",
                      });
                      return;
                    }

                    if (
                      securityData.newPassword !== securityData.confirmPassword
                    ) {
                      setMessage({
                        type: "error",
                        text: "Les mots de passe ne correspondent pas",
                      });
                      return;
                    }

                    if (securityData.newPassword.length < 8) {
                      setMessage({
                        type: "error",
                        text: "Le mot de passe doit faire au moins 8 caractères",
                      });
                      return;
                    }

                    const res = await fetch("/api/auth/update-password", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        currentPassword: securityData.currentPassword,
                        newPassword: securityData.newPassword,
                      }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                      setMessage({ type: "success", text: data.message });
                      setSecurityData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    } else {
                      setMessage({
                        type: "error",
                        text: data.errors
                          ? Object.values(data.errors).join(", ")
                          : data.message,
                      });
                    }
                  } catch (error) {
                    setMessage({
                      type: "error",
                      text: "Erreur lors du changement de mot de passe",
                    });
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {/* Password fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={securityData.currentPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-white/5 
                               text-gray-900 dark:text-white border border-gray-200 dark:border-white/10
                               focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={securityData.newPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-white/5 
                               text-gray-900 dark:text-white border border-gray-200 dark:border-white/10
                               focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={securityData.confirmPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-white/5 
                               text-gray-900 dark:text-white border border-gray-200 dark:border-white/10
                               focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-md text-white font-medium
           bg-orion-nebula hover:bg-orion-purple transition-colors
           disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Mise à jour..."
                      : "Mettre à jour le mot de passe"}
                  </button>
                </div>
                {message && (
                  <div
                    className={`p-4 rounded-md ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </form>
            </div>

            {/* Connected Devices Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Appareils connectés
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gérez vos sessions actives
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {devices.map((device) => {
                  // Détecter le navigateur
                  const userAgent = device.user_agent.toLowerCase();
                  let browser = "Navigateur inconnu";

                  if (userAgent.includes("firefox")) {
                    browser = "Firefox";
                  } else if (userAgent.includes("chrome")) {
                    browser = "Chrome";
                  } else if (userAgent.includes("safari")) {
                    browser = "Safari";
                  } else if (userAgent.includes("edge")) {
                    browser = "Edge";
                  }

                  const isWindows = userAgent.includes("windows");

                  return (
                    <div
                      key={device.id}
                      className="bg-gray-50 dark:bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {isWindows ? (
                            <Monitor className="h-10 w-10 text-gray-400" />
                          ) : (
                            <Smartphone className="h-10 w-10 text-gray-400" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 dark:text-white">
                                {isWindows ? "PC Windows" : "Appareil mobile"}
                              </p>
                              {device.is_trusted ? (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400">
                                  Appareil vérifié
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400">
                                  Non vérifié
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {browser} • IP: {device.last_ip}
                            </p>
                            <p className="text-xs text-gray-400">
                              Dernière connexion :{" "}
                              {new Date(device.updated_at).toLocaleString(
                                "fr-FR"
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/users/devices", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  deviceId: device.device_id,
                                }),
                              });

                              if (res.ok) {
                                // Recharger la liste des appareils
                                loadUserDevices();
                              } else {
                                const errorData = await res.json();
                                console.error("Erreur :", errorData.message);
                              }
                            } catch (error) {
                              console.error("Erreur de déconnexion :", error);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Déconnecter cet appareil"
                        >
                          <LogOut className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <div className="divide-y divide-gray-200 dark:divide-white/10">
              <div className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Rapports
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Notifications pour les nouveaux rapports
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notificationsData.emailReports}
                    onChange={() => handleNotificationToggle("emailReports")}
                  />
                </div>
              </div>

              <div className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                      <Gift className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Offres
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Offres et nouveautés
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notificationsData.emailPromotions}
                    onChange={() => handleNotificationToggle("emailPromotions")}
                  />
                </div>
              </div>

              <div className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
                      <Shield className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Sécurité
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Alertes de sécurité importantes
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={notificationsData.emailSecurity}
                    onChange={() => handleNotificationToggle("emailSecurity")}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-orion-dark-bg">
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
            {titles[activeTab].title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {titles[activeTab].description}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between group rounded-md ${
                  activeTab === "profile"
                    ? "text-orion-nebula bg-orion-nebula/5 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                Informations personnelles
                {activeTab !== "profile" && (
                  <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between group rounded-md ${
                  activeTab === "security"
                    ? "text-orion-nebula bg-orion-nebula/5 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                Sécurité
                {activeTab !== "security" && (
                  <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between group rounded-md ${
                  activeTab === "notifications"
                    ? "text-orion-nebula bg-orion-nebula/5 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                }`}
              >
                Notifications
                {activeTab !== "notifications" && (
                  <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
