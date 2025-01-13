import { motion } from "framer-motion";
import {
  Gauge,
  Search,
  BarChart3,
  Lightbulb,
  RefreshCw,
  Brain,
} from "lucide-react";

const features = [
  {
    icon: Gauge,
    title: "Analyse de performance",
    description:
      "Évaluez la vitesse de chargement de votre site et optimisez sa performance pour une meilleure expérience utilisateur.",
  },
  {
    icon: Search,
    title: "Audit SEO",
    description:
      "Améliorez votre référencement avec des analyses sur les balises, mots-clés et backlinks de votre site.",
  },
  {
    icon: BarChart3,
    title: "Rapports interactifs",
    description:
      "Consultez vos résultats à travers des graphiques interactifs et des rapports détaillés.",
  },
  {
    icon: Lightbulb,
    title: "Recommandations personnalisées",
    description:
      "Bénéficiez de conseils ciblés pour améliorer la vitesse, le SEO, la sécurité et l'accessibilité de votre site.",
  },
  {
    icon: Brain,
    title: "Optimisation IA",
    description:
      "L'IA analyse votre site et génère des astuces précises adaptées à ses besoins pour améliorer ses performances et sa visibilité.",
  },
  {
    icon: RefreshCw,
    title: "Suivi dynamique",
    description:
      "Suivez en temps réel les performances de votre site et ajustez-les automatiquement selon les évolutions observées.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 bg-orion-dark-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-orion-dark-bg via-black/50 to-orion-dark-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 font-spaceg">
              Toutes les fonctionnalités dont vous avez besoin
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Des outils puissants pour optimiser et sécuriser votre présence en
            ligne
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full p-8 bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-300">
                {/* Pattern background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                <div className="relative space-y-4">
                  {/* Icône avec glow effect */}
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-orion-nebula/20 blur-xl rounded-full group-hover:bg-orion-nebula/30 transition-colors duration-500" />
                    <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                      <feature.icon className="w-6 h-6 text-orion-nebula" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-orion-nebula transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
