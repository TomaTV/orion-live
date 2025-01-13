import { useState } from 'react';
import Image from 'next/image';
import Logo from './Logo';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ici, ajouter la logique d'authentification
    // Pour l'instant, simulation
    localStorage.setItem('auth_token', 'fake_token');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec Logo */}
      <div className="p-6">
        <Logo />
      </div>

      {/* Card de connexion */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome back</h2>
          <p className="text-gray-600 mb-8">
            New to Orion? <span className="text-blue-600 hover:text-blue-500 cursor-pointer">Create an account</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue
              </button>
            </div>
          </form>

          {/* Séparateur */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Bouton Google */}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                // Ajouter la logique de connexion Google ici
                localStorage.setItem('auth_token', 'google_token');
                onLoginSuccess();
              }}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Image
                src="/img/google.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Google
            </button>
          </div>

          {/* Terms of Service */}
          <p className="mt-8 text-xs text-center text-gray-500">
            By signing in, you agree to our{' '}
            <span className="text-blue-600 hover:text-blue-500 cursor-pointer">Terms of Service</span>
          </p>
        </div>
      </div>
    </div>
  );
}
