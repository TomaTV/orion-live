import { useEffect, useState } from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import HowItWorks from "@/components/landing/HowItWorks";
import Faq from "@/components/landing/FAQ";
import Image from "next/image";
import { useSmoothScroll } from "@/components/hooks/useSmoothScroll";
import useMobile from "@/components/hooks/useMobile"; // Import du hook

export default function Home() {
  const [opacity, setOpacity] = useState(1);
  const isMobile = useMobile(); // Utilisation du hook

  useEffect(() => {
    const updateOpacity = () =>
      setOpacity(1 - Math.min(window.scrollY / 500, 1));
    updateOpacity();
    window.addEventListener("scroll", updateOpacity);
    return () => window.removeEventListener("scroll", updateOpacity);
  }, []);

  useSmoothScroll();

  return (
    <div
      className={`relative min-h-screen bg-orion-dark-bg ${isMobile ? "overflow-x-hidden" : ""}`} // Ajout conditionnel de classes pour mobile
    >
      {/* Gradient global */}
      <div
        className="fixed inset-0 z-20 h-[120vh] pointer-events-none"
        style={{ opacity }}
      >
        <Image
          src="/img/gradient.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Faq />
    </div>
  );
}
