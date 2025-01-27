import { jsPDF } from "jspdf";

export const exportPerformanceReport = (data) => {
  const pdf = new jsPDF();
  let y = 20;

  // Styles globaux
  const setFont = (size, style = "normal") => {
    pdf.setFont("helvetica", style);
    pdf.setFontSize(size);
    pdf.setTextColor(0, 0, 0);
  };

  // Titre
  setFont(16, "bold");
  pdf.text("Rapport de Performance", 15, y);

  // Date de l'analyse
  y += 15;
  setFont(12);
  pdf.text(`Date : ${new Date(data.timestamp).toLocaleString()}`, 15, y);

  // URL
  y += 10;
  pdf.text(`URL : ${data.url}`, 15, y);

  // Score global
  y += 10;
  const scoreColor =
    data.performance.score >= 90
      ? [34, 197, 94] // Vert
      : data.performance.score >= 50
        ? [249, 115, 22] // Orange
        : [239, 68, 68]; // Rouge

  pdf.setTextColor(...scoreColor);
  setFont(14, "bold");
  pdf.text(`Performance : ${data.performance.score}/100`, 15, y);

  // Remettre la couleur du texte à noir pour les métriques
  pdf.setTextColor(0, 0, 0);

  // Section des métriques
  y += 15;
  setFont(14, "bold");
  pdf.text("Métriques de Performance :", 15, y);

  const metrics = [
    {
      title: "First Contentful Paint (FCP)",
      value: data.performance.metrics.FCP,
      description: "Premier affichage de contenu",
    },
    {
      title: "Largest Contentful Paint (LCP)",
      value: data.performance.metrics.LCP,
      description: "Chargement du contenu principal",
    },
    {
      title: "Total Blocking Time (TBT)",
      value: data.performance.metrics.TBT,
      description: "Temps de blocage",
    },
    {
      title: "Cumulative Layout Shift (CLS)",
      value: data.performance.metrics.CLS,
      description: "Stabilité visuelle",
    },
  ];

  metrics.forEach((metric) => {
    y += 10;
    setFont(12, "bold");
    pdf.text(`${metric.title}: ${metric.value}`, 15, y);

    y += 6;
    setFont(10);
    pdf.text(metric.description, 20, y);
  });

  // Sauvegarde du PDF
  pdf.save(`performance_${data.url.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
};
