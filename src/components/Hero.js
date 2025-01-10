import Link from "next/link";
import Chart from "./ui/Chart";

export default function Hero() {
  return (
    <div className="relative z-30 w-full min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-inter text-white pt-24">
      <div className="space-y-8 text-center">
        {/* améliorer le visuel */}
        <h1 className="font-bold text-6xl sm:text-7xl lg:text-8xl max-w-8xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
          Boostez la performance,
        </h1>
        <h2 className="font-bold text-6xl sm:text-7xl lg:text-8xl max-w-8xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
          de votre site web.
        </h2>
       
        {/* améliorer le visuel */}
        <p className="text-lg sm:text-xl max-w-2xl mx-auto bg-clip-text text-transparent bg-gradient-to-tr from-white via-white to-[#71717A] leading-relaxed">
          Orion vous offre des analyses détaillées et des recommandations claires pour optimiser votre présence en ligne.
        </p>

        {/* bouton à changer */}
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Link href="/" className="inline-flex items-center px-8 py-4 bg-orion-nebula text-white rounded-lg hover:bg-orion-nebula/90 transition-all transform hover:scale-105">
            <span className="font-medium">Commencer gratuitement</span>
          </Link>
          <Link href="/" className="inline-flex items-center px-8 py-4 border-2 border-orion-nebula text-white rounded-lg hover:bg-orion-nebula/10 transition-all transform hover:scale-105">
            <span className="font-medium">Voir une démo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}