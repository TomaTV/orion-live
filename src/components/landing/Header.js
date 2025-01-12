import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header className="relative z-30 w-full h-16 font-spaceg">
      <div
        className={`fixed w-full top-0 transition-all duration-300 ${
          scrolled ? "bg-black/20 backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center gap-x-3">
              <div className="relative">
                <Image
                  src="/img/logo.png"
                  alt="Logo Orion"
                  width={40}
                  height={40}
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-white">Orion</span>
            </Link>

            <div className="hidden md:flex items-center gap-x-8 mx-16">
              <Link
                href="#features"
                className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2"
              >
                Fonctionnalités
              </Link>
              <Link
                href="#pricing"
                className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2"
              >
                Tarifs
              </Link>
              <Link
                href="#faq"
                className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2"
              >
                FAQ
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-x-4 ml-auto">
              <Link
                href="/app"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors hover:bg-white/5"
              >
                Connexion
              </Link>
              <Link
                href="/app"
                className="bg-orion-nebula text-white px-4 py-2 rounded-lg hover:bg-transparent border border-orion-nebula hover:border-orion-nebula hover:text-orion-nebula transition-colors font-medium"
              >
                Essai gratuit
              </Link>
            </div>

            <button className="md:hidden ml-auto text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
