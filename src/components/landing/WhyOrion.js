import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const WhyOrionSection = () => {
  const [selectedTool, setSelectedTool] = useState('performance');

  const tools = {
    performance: {
      title: "Outils de performance",
      description: "GTmetrix, PageSpeed Insights...",
      limitations: [
        "Analyse limitée à la performance",
        "Pas d'intégration SEO",
        "Rapports techniques complexes",
        "Pas de suivi continu"
      ]
    },
    seo: {
      title: "Outils SEO",
      description: "Yoast, SEMrush, Ahrefs...",
      limitations: [
        "Coûts élevés par outil",
        "Focus uniquement SEO",
        "Interface complexe",
        "Apprentissage long"
      ]
    },
    security: {
      title: "Solutions de sécurité",
      description: "Sucuri, WP Scan...",
      limitations: [
        "Protection limitée",
        "Pas d'analyse globale",
        "Configuration complexe",
        "Alertes techniques"
      ]
    }
  };

  const orionAdvantages = [
    "Analyse complète : Performance + SEO + Sécurité",
    "Interface intuitive et rapports clairs",
    "Recommandations pratiques par IA",
    "Prix unique, tout inclus",
    "Suivi en temps réel",
    "Support réactif en français"
  ];

  return (
    <section className="py-24 bg-orion-dark-bg relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 font-spaceg">
              Pourquoi choisir Orion ?
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Une solution unique pour remplacer de multiples outils coûteux et complexes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Traditional Tools */}
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 mb-8">
              {Object.keys(tools).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedTool(key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedTool === key
                      ? 'bg-orion-nebula text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {tools[key].title}
                </button>
              ))}
            </div>

            <motion.div
              key={selectedTool}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {tools[selectedTool].title}
              </h3>
              <p className="text-gray-400 mb-6">
                {tools[selectedTool].description}
              </p>

              <div className="space-y-3">
                {tools[selectedTool].limitations.map((limitation, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-300">{limitation}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right side - Orion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:pl-12 relative"
          >
            <div className="bg-gradient-to-br from-orion-nebula/20 to-transparent rounded-2xl p-8 border border-orion-nebula/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orion-nebula/20 rounded-xl">
                  <img
                    src="/img/Logo 2.png"
                    alt="Orion Logo"
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Solution Orion</h3>
                  <p className="text-gray-400">Tout-en-un</p>
                </div>
              </div>

              <div className="space-y-4">
                {orionAdvantages.map((advantage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-orion-nebula flex-shrink-0" />
                    <span className="text-gray-200">{advantage}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-gray-300">
                  <AlertCircle className="w-5 h-5 text-orion-nebula" />
                  <p className="text-sm">
                    En moyenne, nos clients économisent 60% sur leurs outils d'analyse web
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyOrionSection;