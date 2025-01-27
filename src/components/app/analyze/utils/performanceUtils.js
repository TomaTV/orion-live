export const getPerformanceRecommendations = (metrics) => {
  const recommendations = [];

  // FCP
  const fcpValue = parseFloat(metrics.FCP);
  if (fcpValue > 2.5) {
    recommendations.push({
      type: 'error',
      title: 'First Contentful Paint trop lent',
      description: 'Optimisez le chargement initial en réduisant les ressources bloquantes.',
      impact: 'high'
    });
  }

  // LCP
  const lcpValue = parseFloat(metrics.LCP);
  if (lcpValue > 2.5) {
    recommendations.push({
      type: 'error',
      title: 'Largest Contentful Paint à améliorer',
      description: 'Optimisez les images et le contenu principal de la page.',
      impact: 'high'
    });
  }

  // TBT
  const tbtValue = parseFloat(metrics.TBT);
  if (tbtValue > 300) {
    recommendations.push({
      type: 'error',
      title: 'Temps de blocage excessif',
      description: 'Réduisez les opérations JavaScript lourdes et fractionnez le code.',
      impact: 'high'
    });
  }

  // CLS
  const clsValue = parseFloat(metrics.CLS);
  if (clsValue > 0.1) {
    recommendations.push({
      type: 'warning',
      title: 'Instabilité visuelle détectée',
      description: 'Définissez les dimensions des images et évitez les insertions dynamiques de contenu.',
      impact: 'medium'
    });
  }

  // Recommandations générales
  recommendations.push({
    type: 'info',
    title: 'Mise en cache',
    description: 'Mettez en place une stratégie de mise en cache efficace.',
    impact: 'medium'
  });

  recommendations.push({
    type: 'info',
    title: 'Compression des ressources',
    description: 'Activez la compression Gzip/Brotli pour les ressources textuelles.',
    impact: 'medium'
  });

  return recommendations;
};

export const getMetricType = (metricName, value) => {
  switch (metricName) {
    case 'FCP':
    case 'LCP':
      const timeValue = parseFloat(value);
      if (timeValue <= 2.5) return 'success';
      if (timeValue <= 4) return 'warning';
      return 'error';
    
    case 'TBT':
      const tbtValue = parseFloat(value);
      if (tbtValue <= 200) return 'success';
      if (tbtValue <= 600) return 'warning';
      return 'error';
    
    case 'CLS':
      const clsValue = parseFloat(value);
      if (clsValue <= 0.1) return 'success';
      if (clsValue <= 0.25) return 'warning';
      return 'error';
      
    default:
      return 'neutral';
  }
};