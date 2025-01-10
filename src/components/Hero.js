import Link from "next/link";
import Chart from "./ui/Chart";

export default function Hero() {
 return (
   <div className="relative w-full min-h-screen flex items-center justify-center -mt-20">
     <Chart />
     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orion-dark-bg opacity-90"></div>

     <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
       <h1 className="font-inter font-bold text-6xl sm:text-7xl lg:text-8xl leading-[1.1] bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, white 0%, white 40%, #71717A 100%)' }}>
         Boostez la performance, le SEO et la sécurité.
       </h1>
       
       <p className="mt-8 text-xl sm:text-2xl max-w-3xl mx-auto text-gray-300 font-inter">
         Orion vous offre des analyses détaillées et des recommandations claires pour optimiser votre présence en ligne.
       </p>
     </div>
   </div>
 );
}