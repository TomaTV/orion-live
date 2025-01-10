  import React, { useEffect } from 'react';

  export default function Chart() {
    useEffect(() => {
      const canvas = document.getElementById('chart');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawChart();
      };

      const drawChart = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Créer un dégradé radial pour l'effet de la grille
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0, // Centre du canvas
          canvas.width / 2, canvas.height / 2, canvas.width / 2 // Extérieur du canvas
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');  // Centre visible
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');  // Milieu
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');  // Bords invisibles

        // Grille avec moins de lignes (plus espacées)
        ctx.beginPath();
        const gridLines = 15; // Réduit de 40 à 15 pour des carrés plus grands
        for (let i = 0; i <= gridLines; i++) {
          const x = (i / gridLines) * canvas.width;
          const y = (i / gridLines) * canvas.height;
          
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
        }
        ctx.strokeStyle = gradient;  // Applique le gradient à la grille
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ligne principale en style "stonks"
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.7);  // Départ

        // Série de segments "stonks"
        const points = [
          [canvas.width * 0.2, canvas.height * 0.6],   // Monte
          [canvas.width * 0.3, canvas.height * 0.65],  // Petite baisse
          [canvas.width * 0.4, canvas.height * 0.45],  // Forte hausse
          [canvas.width * 0.5, canvas.height * 0.5],   // Légère baisse
          [canvas.width * 0.6, canvas.height * 0.35],  // Nouvelle hausse
          [canvas.width * 0.7, canvas.height * 0.4],   // Petite baisse
          [canvas.width * 0.8, canvas.height * 0.25],  // Forte hausse
          [canvas.width * 0.9, canvas.height * 0.3],   // Légère baisse
          [canvas.width, canvas.height * 0.2],         // Hausse finale
        ];

        points.forEach(point => {
          ctx.lineTo(point[0], point[1]);
        });

        // Créer un gradient pour la ligne
        const lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        lineGradient.addColorStop(0, 'rgba(92, 77, 255, 0.8)');
        lineGradient.addColorStop(0.5, 'rgba(92, 77, 255, 0.5)');
        lineGradient.addColorStop(1, 'rgba(0, 207, 255, 0.3)');

        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';
        ctx.stroke();

        ctx.shadowColor = 'rgba(92, 77, 255, 0.3)';
        ctx.shadowBlur = 10;
        ctx.stroke();
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    return (
      <canvas 
        id="chart"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
    );
  }