import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import HeaderApp from "@/components/app/Header";
import AdminOnly from "@/components/hooks/AdminOnly";
import AnalyzeResult from "@/components/app/analyze/AnalyzeResult";

function AppPage() {
  const router = useRouter();
  const [analyzeData, setAnalyzeData] = useState(null);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-orion-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orion-nebula"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-orion-dark-bg bg-gray-50">
      <HeaderApp onAnalyzeComplete={setAnalyzeData} />

      <div className="container mx-auto px-4 py-8">
        {analyzeData ? (
          <AnalyzeResult data={analyzeData} />
        ) : (
          <AdminOnly>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-spaceg">
                Tableau de bord
              </h1>
              <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Bienvenue sur votre tableau de bord, {session.user.email} !
                </p>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Commencez par analyser un site web en utilisant la barre de
                  recherche ci-dessus.
                </p>
              </div>
            </div>
          </AdminOnly>
        )}
      </div>
    </div>
  );
}

export default AppPage;
