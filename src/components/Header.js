import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="relative z-30 w-full h-16 font-spaceg bg-transparent">
      <div className="fixed w-full top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-x-3">
                  <Image
                    src="/img/logo.png"
                    alt="Logo Orion"
                    width={40}
                    height={40}
                    priority
                  />
                  <span className="text-2xl font-bold text-white">Orion</span>
                </div>
              </div>

              <div className="hidden md:flex items-center ml-16 gap-x-10">
                <button className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2">
                  Fonctionnalités
                </button>
                <button className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2">
                  Tarifs
                </button>
                <button className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2">
                  FAQ
                </button>
              </div>
            </div>

            {/* CTAs - Alignés à droite */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-orion-nebula text-white px-4 py-2 rounded-lg hover:bg-transparent border border-orion-nebula hover:border-orion-nebula hover:text-orion-nebula transition-colors font-medium"
              >
                Essai gratuit
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
