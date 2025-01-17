import { useState, useEffect } from "react";

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 768px pour considérer comme mobile
    };

    // Vérification initiale
    checkMobile();

    // Ajouter un écouteur pour la redimension de la fenêtre
    window.addEventListener("resize", checkMobile);

    // Nettoyer l'écouteur lors du démontage
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default useMobile;
