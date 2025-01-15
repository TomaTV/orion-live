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
    size: "wide", // rectangle en longueur
  },
  {
    icon: Search,
    title: "Audit SEO",
    description:
      "Améliorez votre référencement avec des analyses sur les balises, mots-clés et backlinks de votre site.",
    size: "square", // carré
  },
  {
    icon: BarChart3,
    title: "Rapports interactifs",
    description:
      "Consultez vos résultats à travers des graphiques interactifs et des rapports détaillés.",
    size: "square", // carré
  },
  {
    icon: Lightbulb,
    title: "Recommandations personnalisées",
    description:
      "Bénéficiez de conseils ciblés pour améliorer la vitesse, le SEO, la sécurité et l'accessibilité de votre site.",
    size: "square", // carré
  },
  {
    icon: Brain,
    title: "Optimisation IA",
    description:
      "L'IA analyse votre site et génère des astuces précises adaptées à ses besoins pour améliorer ses performances et sa visibilité.",
    size: "tall", // rectangle en hauteur
  },
  {
    icon: RefreshCw,
    title: "Suivi dynamique",
    description:
      "Suivez en temps réel les performances de votre site et ajustez-les automatiquement selon les évolutions observées.",
    size: "wide", // rectangle en longueur
  },
];

const sizeClasses = {
  square: "col-span-1 row-span-1 h-64",
  wide: "col-span-2 row-span-1 h-64",
  tall: "col-span-1 row-span-2 h-[33.5rem]",
};

const featureVariants = {
  hidden: { opacity: 0, scale: 0.9, rotate: 0, y: 50 },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      delay: index * 0.15,
    },
  }),
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 bg-orion-dark-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-orion-dark-bg via-black/50 to-orion-dark-bg pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
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
              custom={index}
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`group ${sizeClasses[feature.size]}`}
            >
              <div className="relative h-full p-8 bg-white/[0.03] border border-white/[0.05] rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-300">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                <div className="relative space-y-4">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
                  >
                    <feature.icon className="w-6 h-6 text-orion-nebula" />
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-orion-nebula transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-orion-nebula/20 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
