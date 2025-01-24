import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { scrollTo } from "../hooks/useSmoothScroll";

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

  const handleNavClick = (e, target) => {
    e.preventDefault();
    scrollTo(target);
  };

  return (
    <header className="relative z-30 w-full h-15 font-spaceg">
      <div
        className={`fixed w-full top-0 transition-all duration-300 ${
          scrolled ? "bg-black/20 backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="#hero"
              className="flex items-center gap-x-3"
              onClick={(e) => handleNavClick(e, "#hero")}
            >
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
              <a
                href="#features"
                onClick={(e) => handleNavClick(e, "#features")}
                className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2"
              >
                Fonctionnalités
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleNavClick(e, "#pricing")}
                className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2"
              >
                Tarifs
              </a>
              <a
                href="#faq"
                onClick={(e) => handleNavClick(e, "#faq")}
                className="text-gray-300 hover:text-white transition-colors hover:bg-white/5 rounded-lg px-4 py-2"
              >
                FAQ
              </a>
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

            <Link
              href="/app"
              className="md:hidden ml-auto text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <User size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
