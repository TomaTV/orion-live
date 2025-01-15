import Link from "next/link";
import Chart from "../ui/Chart";
import { Sparkles, ChevronDown, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";
import { scrollTo } from "../hooks/useSmoothScroll";

export default function Hero() {
  const handleHeroClick = (e, target) => {
    e.preventDefault();
    scrollTo(target);
  };
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center -mt-20">
      {/* Chart en arrière-plan */}
      <Chart />

      {/* Gradient overlay amélioré */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orion-dark-bg opacity-90" />

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto px-4 sm:px-6 text-center"
      >
        <motion.h1
          className="font-inter font-bold text-[5rem] sm:text-[6rem] lg:text-[7rem] tracking-tight leading-[1.1] bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(160deg, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(113, 113, 122, 0.9) 75%, #71717A 100%)",
          }}
        >
          Boostez la performance,
          <br />
          le SEO et la sécurité
        </motion.h1>

        <motion.p className="mt-8 text-xl sm:text-2xl max-w-3xl mx-auto text-gray-300 font-inter">
          Orion vous offre des analyses détaillées et des recommandations
          claires pour optimiser votre présence en ligne.
        </motion.p>

        <motion.div
          className="mt-14 flex justify-center"
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

              <Sparkles className="w-5 h-5 group-hover:hidden" />
              <WandSparkles className="w-5 h-5 hidden group-hover:block" />
              <span>Voir une démo</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex justify-center"
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        <ChevronDown className="w-8 h-8 text-white opacity-80" />
      </motion.div>
    </div>
  );
}
