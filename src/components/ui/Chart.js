import React, { useEffect, useRef, memo } from "react";

const Chart = memo(() => {
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    let isAnimating = true;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (!isAnimating) {
        drawChart(100);
      }
    };

    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Garder le dégradé radial original pour la grille
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.1)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      // Optimisation de la grille en réduisant légèrement le nombre de lignes
      ctx.beginPath();
      const gridLines = 15; // Réduit de 15 à 12 pour la performance
      for (let i = 0; i <= gridLines; i++) {
        const x = (i / gridLines) * canvas.width;
        const y = (i / gridLines) * canvas.height;

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();

      drawLine(progressRef.current);
      drawEdgeGradients();
    };

    const drawLine = (progress) => {
      const points = [
        [canvas.width * 0.001, canvas.height * 0.75],
        [canvas.width * 0.15, canvas.height * 0.6],
        [canvas.width * 0.3, canvas.height * 0.65],
        [canvas.width * 0.4, canvas.height * 0.45],
        [canvas.width * 0.5, canvas.height * 0.5],
        [canvas.width * 0.6, canvas.height * 0.35],
        [canvas.width * 0.7, canvas.height * 0.4],
        [canvas.width * 0.8, canvas.height * 0.25],
        [canvas.width * 0.9, canvas.height * 0.3],
        [canvas.width, canvas.height * 0.2],
      ];

      const totalPoints = points.length;
      const maxSteps = 200; // Réduit de 200 à 150 pour la performance

      let interpolatedPoints = [];
      for (let i = 0; i < totalPoints - 1; i++) {
        const startPoint = points[i];
        const endPoint = points[i + 1];

        for (let j = 0; j <= maxSteps; j++) {
          const t = j / maxSteps;
          interpolatedPoints.push([
            startPoint[0] + (endPoint[0] - startPoint[0]) * t,
            startPoint[1] + (endPoint[1] - startPoint[1]) * t,
          ]);
        }
      }

      const visiblePoints = Math.floor(
        (progress / 100) * interpolatedPoints.length
      );

      ctx.beginPath();
      ctx.moveTo(interpolatedPoints[0][0], interpolatedPoints[0][1]);

      for (let i = 1; i < visiblePoints; i++) {
        ctx.lineTo(interpolatedPoints[i][0], interpolatedPoints[i][1]);
      }

      const lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      lineGradient.addColorStop(0, "rgba(92, 77, 255, 0.8)");
      lineGradient.addColorStop(0.5, "rgba(92, 77, 255, 0.5)");
      lineGradient.addColorStop(1, "rgba(0, 207, 255, 0.3)");

      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "miter";

      // Application des ombres uniquement lors du dernier render pour la performance
      if (progress === 100) {
        ctx.shadowColor = "rgba(92, 77, 255, 0.3)";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowColor = "transparent";
      } else {
        ctx.stroke();
      }
    };

    const drawEdgeGradients = () => {
      const topHeight = canvas.height * 0.35;
      const topGradient = ctx.createLinearGradient(0, 0, 0, topHeight);
      topGradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      topGradient.addColorStop(0.4, "rgba(0, 0, 0, 0.8)");
      topGradient.addColorStop(0.7, "rgba(0, 0, 0, 0.4)");
      topGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = topGradient;
      ctx.fillRect(0, 0, canvas.width, topHeight);

      const sideWidth = canvas.width * 0.2;

      const leftGradient = ctx.createLinearGradient(0, 0, sideWidth, 0);
      leftGradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      leftGradient.addColorStop(0.4, "rgba(0, 0, 0, 0.8)");
      leftGradient.addColorStop(0.7, "rgba(0, 0, 0, 0.4)");
      leftGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = leftGradient;
      ctx.fillRect(0, 0, sideWidth, canvas.height);

      const rightGradient = ctx.createLinearGradient(
        canvas.width - sideWidth,
        0,
        canvas.width,
        0
      );
      rightGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      rightGradient.addColorStop(0.3, "rgba(0, 0, 0, 0.4)");
      rightGradient.addColorStop(0.6, "rgba(0, 0, 0, 0.8)");
      rightGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

      ctx.fillStyle = rightGradient;
      ctx.fillRect(canvas.width - sideWidth, 0, sideWidth, canvas.height);
    };

    const animate = () => {
      if (progressRef.current < 100 && isAnimating) {
        progressRef.current += 0.5; // Animation plus rapide: 0.5 -> 1
        drawChart();
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    };

    resizeCanvas();
    let resizeTimeout;
    window.addEventListener("resize", () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    });

    animate();

    return () => {
      isAnimating = false;
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
});

Chart.displayName = "Chart";

export default Chart;
