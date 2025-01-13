import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Ne vérifie l'authentification que pour les routes /app
    if (router.pathname.startsWith('/app')) {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;