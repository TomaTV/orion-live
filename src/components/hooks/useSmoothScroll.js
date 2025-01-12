import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2,
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      lerp: 0.05,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    window.lenis = lenis;

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);
};
