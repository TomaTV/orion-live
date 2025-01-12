import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Error404() {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center bg-orion-dark-bg justify-center overflow-hidden">
      {/* Animation de fond scintillant */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orion-dark-bg/70 to-black opacity-80 animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent,_#1e293b)] opacity-50" />

      {/* Étoiles animées */}
      <div className="absolute inset-0">
        <div className="absolute w-[3px] h-[3px] bg-white rounded-full opacity-70 animate-[pulse_2s_infinite_ease-in-out] left-[10%] top-[20%]" />
        <div className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-60 animate-[pulse_3s_infinite_ease-in-out] left-[70%] top-[50%]" />
        <div className="absolute w-[1.5px] h-[1.5px] bg-white rounded-full opacity-80 animate-[pulse_4s_infinite_ease-in-out] left-[40%] top-[80%]" />
      </div>

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto px-4 sm:px-6 text-center"
      >
        <motion.h1
          className="font-inter font-bold text-[5rem] sm:text-[6rem] lg:text-[7rem] tracking-tight leading-[1.1] bg-clip-text text-transparent shadow-md"
          style={{
            backgroundImage:
              "linear-gradient(160deg, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(113, 113, 122, 0.9) 75%, #71717A 100%)",
          }}
        >
          404
        </motion.h1>

        <motion.p className="mt-4 text-2xl sm:text-3xl max-w-3xl mx-auto text-gray-300 font-inter shadow-sm">
          Oups ! La page que vous cherchez est introuvable.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/"
            className="group relative flex items-center gap-2 px-8 py-4 text-white border-t border-l border-r border-white/20 rounded-full shadow-lg transition-all duration-300 hover:bg-black/20"
          >
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orion-nebula/40 to-transparent" />

            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-transparent via-orion-nebula to-transparent" />

            <Sparkles className="w-5 h-5 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110" />
            <span>Retour à l&apos;accueil</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
