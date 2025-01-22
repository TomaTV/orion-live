/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, FileText, Gift, Shield, Loader2 } from "lucide-react";
import HeaderApp from "@/components/app/Header";
import Link from "next/link";

const NotificationsPage = () => {
  const { data: session, status } = useSession({ required: true });
  const [formData, setFormData] = useState({
    emailReports: true,
    emailPromotions: false,
    emailSecurity: true,
  });

  const handleToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const Toggle = ({ enabled, onChange }) => (
    <button
      type="button"
      className={`${enabled ? 'bg-orion-nebula' : 'bg-gray-200 dark:bg-white/10'}
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full 
                  border-2 border-transparent transition-colors duration-300 ease-in-out
                  focus:outline-none`}
      onClick={onChange}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full
                   bg-white shadow ring-0 transition-transform duration-300 ease-in-out`}
      />
    </button>
  );
  
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
            Préférences de notification
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez vos préférences de notification par email.
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
              <Link
                href="/app/profil/security"
                className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md flex items-center justify-between group"
              >
                Sécurité
                <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <button className="w-full text-left px-3 py-2 text-sm font-medium text-orion-nebula bg-orion-nebula/5 rounded-md">
                Notifications
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <div className="divide-y divide-gray-200 dark:divide-white/10">
                {/* Reports Notifications */}
                <div className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Rapports et mises à jour
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notifications pour les nouveaux rapports disponibles
                        </p>
                      </div>
                    </div>
                    <Toggle 
                      enabled={formData.emailReports} 
                      onChange={() => handleToggle('emailReports')} 
                    />
                  </div>
                </div>

                {/* Promotional Notifications */}
                <div className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                        <Gift className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Offres et promotions
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notifications sur les offres et nouveautés
                        </p>
                      </div>
                    </div>
                    <Toggle 
                      enabled={formData.emailPromotions} 
                      onChange={() => handleToggle('emailPromotions')} 
                    />
                  </div>
                </div>

                {/* Security Notifications */}
                <div className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg">
                        <Shield className="w-5 h-5 text-red-500 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          Alertes de sécurité
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Notifications importantes sur la sécurité du compte
                        </p>
                      </div>
                    </div>
                    <Toggle 
                      enabled={formData.emailSecurity} 
                      onChange={() => handleToggle('emailSecurity')} 
                    />
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

export default NotificationsPage;