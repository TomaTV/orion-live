import withAuth from '../../components/hooks/withAuth';
import { useRouter } from 'next/router';

function HeaderApp() {  
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
    );
    }
    
    export default withAuth(HeaderApp);