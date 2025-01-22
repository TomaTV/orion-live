/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle2, Loader2, KeyRound, Clock, Smartphone, LogOut } from "lucide-react";
import HeaderApp from "@/components/app/Header";
import Link from "next/link";

const SecurityPage = () => {
  const { data: session, status } = useSession({ required: true });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  if (status === "loading") {
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
            Paramètres de sécurité
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez la sécurité de votre compte et vos appareils connectés.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-1">
              <Link
                href="/app/profil"
                className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md flex items-center justify-between group"
              >
                Informations personnelles
                <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-orion-nebula bg-orion-nebula/5 rounded-md">
                Sécurité
              </button>
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
            {/* Password Change Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Changer le mot de passe
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Modifiez votre mot de passe pour sécuriser votre compte.
                  </p>
                </div>
                <Shield className="w-5 h-5 text-gray-400" />
              </div>

              <form className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="currentPassword"
                        placeholder="Votre mot de passe actuel"
                        className="w-full pl-10 pr-4 py-2 rounded-md 
                                 bg-white dark:bg-white/5 
                                 text-gray-900 dark:text-white 
                                 border border-gray-200 dark:border-white/10
                                 focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                      />
                      <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="Votre nouveau mot de passe"
                        className="w-full pl-10 pr-4 py-2 rounded-md 
                                 bg-white dark:bg-white/5 
                                 text-gray-900 dark:text-white 
                                 border border-gray-200 dark:border-white/10
                                 focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                      />
                      <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmez votre nouveau mot de passe"
                        className="w-full pl-10 pr-4 py-2 rounded-md 
                                 bg-white dark:bg-white/5 
                                 text-gray-900 dark:text-white 
                                 border border-gray-200 dark:border-white/10
                                 focus:ring-2 focus:ring-orion-nebula focus:border-transparent"
                      />
                      <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-white font-medium
                             bg-orion-nebula hover:bg-orion-purple 
                             transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      Changer le mot de passe
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Last Login Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Dernière connexion
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Informations sur votre dernière session.
                  </p>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      22 janvier 2025 à 15:30
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Paris, France · Firefox sur Windows
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connected Devices Section */}
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Appareils connectés
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gérez vos sessions actives sur différents appareils.
                  </p>
                </div>
                <Smartphone className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {/* Current Device */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Smartphone className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Appareil actuel
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Firefox · Windows · Paris
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:text-green-400 dark:bg-green-400/10">
                      Actif
                    </span>
                  </div>
                </div>

                {/* Other Device */}
                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Smartphone className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          iPhone 13
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Safari · iOS · Lyon
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;