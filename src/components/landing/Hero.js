import { useState, useEffect } from "react";
import Link from "next/link";
import Chart from "../ui/Chart";
import { Sparkles, ChevronDown, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";
import { scrollTo } from "../hooks/useSmoothScroll";
import useMobile from "../hooks/useMobile";

export default function Hero() {
  const isMobile = useMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleHeroClick = (e, target) => {
    e.preventDefault();
    scrollTo(target);
  };

  return (
    <div className="relative w-full min-h-[100svh] flex flex-col items-center justify-center -mt-20 bg-orion-dark-bg">
      {isClient && !isMobile && <Chart />}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orion-dark-bg" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto px-4 sm:px-6 text-center max-w-7xl"
      >
        <motion.h1
          className="font-inter font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[6.5rem] tracking-tight leading-[1.1] bg-clip-text text-transparent mb-4 md:mb-6"
          style={{
            backgroundImage:
              "linear-gradient(160deg, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(113, 113, 122, 0.9) 75%, #71717A 100%)",
          }}
        >
          {isMobile ? (
            <>
              Boostez la
              <br />
              performance, le SEO
              <br />
              et la sécurité
            </>
          ) : (
            <>
              Boostez la performance,
              <br />
              le SEO et la sécurité
            </>
          )}
        </motion.h1>

        <motion.p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-2xl md:max-w-3xl mx-auto text-gray-300 font-inter px-4">
          Orion vous offre des analyses détaillées et des recommandations
          claires pour optimiser votre présence en ligne.
        </motion.p>

        <motion.div
          className="mt-8 sm:mt-10 md:mt-14 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative overflow-hidden rounded-full">
            <Link
              href="#howitworks"
              onClick={(e) => handleHeroClick(e, "#howitworks")}
              className="group relative flex items-center gap-2 px-8 py-4 text-white border-t border-l border-r border-white/20 rounded-full transition-all duration-300 hover:bg-black/20 overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[2px]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orion-nebula/40 to-transparent" />
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orion-nebula to-transparent" />
              </div>

              <motion.div className="relative">
                <motion.div
                  className="w-5 h-5"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  key={isMobile ? "mobile" : "desktop"}
                >
                  <Sparkles className="w-5 h-5 absolute inset-0 group-hover:opacity-0 transition-opacity duration-300" />
                  <WandSparkles className="w-5 h-5 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              </motion.div>
              <span>Voir une démo</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-80" />
      </motion.div>
    </div>
  );
}
