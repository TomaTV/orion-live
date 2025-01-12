import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Réduit pour une animation plus rapide
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1, // Augmenté pour une meilleure réactivité
      lerp: 0.1, // Augmenté pour une interpolation plus rapide
      smoothTouch: false, // Désactive le smooth scroll sur mobile pour de meilleures performances
      touchMultiplier: 2,
      infinite: false, // Désactive le défilement infini si non nécessaire
    });

    let rafId = null;
    
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Optimisation pour le throttling des événements de scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            lenis.stop();
          } else {
            lenis.start();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(document.documentElement);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      observer.disconnect();
      lenis.destroy();
    };
  }, []);
};