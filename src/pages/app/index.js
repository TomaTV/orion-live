import withAuth from '../../components/hooks/withAuth';
import { useRouter } from 'next/router';

function AppPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Appel à l'API de déconnexion
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      // Supprime le cookie côté client
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Redirige vers la page de login
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-orion-dark-bg">
      <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">Orion App</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg p-6 bg-black/30 backdrop-blur-xl border border-white/10">
          <h1 className="text-2xl font-semibold text-white mb-4">
            Tableau de bord
          </h1>
          <p className="text-gray-300">
            Bienvenue dans votre espace personnel
          </p>
        </div>
      </main>
    </div>
  );
}

export default withAuth(AppPage);