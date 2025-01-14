import { useEffect } from "react";
import Lenis from "lenis";

export const scrollTo = (target) => {
  if (typeof window !== "undefined" && window.lenis) {
    const element = document.querySelector(target);
    if (element) {
      window.lenis.scrollTo(element, {
        offset: -100,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }
};

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      lerp: 0.05,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.lenis = lenis;

    return () => {
      window.lenis.destroy();
      window.lenis = null;
    };
  }, []);
};
