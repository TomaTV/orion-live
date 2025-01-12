import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Gratuit",
    price: "0",
    description:
      "Testez Orion gratuitement avec des fonctionnalités de base. Idéal pour une première prise en main.",
    features: [
      "Analyse de performance limitée",
      "1 site web pour les audits",
      "Recommandations de base",
    ],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Pro",
    price: "29",
    description:
      "Pour les professionnels qui ont besoin de fonctionnalités complètes pour une analyse de site web approfondie.",
    features: [
      "Analyse complète de la performance",
      "Audit SEO de base (balises, mots-clés)",
      "5 sites pour les audits",
      "Recommandations avancées",
      "Rapports détaillés",
    ],
    cta: "Choisir le plan Pro",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "99",
    description:
      "Pour les grandes entreprises ou agences nécessitant des fonctionnalités avancées et la gestion de plusieurs sites.",
    features: [
      "Tout du plan Pro",
      "10 sites pour les audits",
      "Analyse de la sécurité et accessibilité",
      "Accès aux statistiques historiques sur 90 jours",
      "Recommandations de sécurité et accessibilité",
      "Gestion multi-sites (10+ sites)",
      "Support prioritaire",
    ],
    cta: "Demander une démo",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 bg-orion-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-white mb-6 font-spaceg">
            Des tarifs adaptés à vos besoins
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choisissez le plan qui correspond le mieux à vos objectifs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group rounded-2xl ${
                plan.popular
                  ? "border-2 border-orion-nebula bg-orion-nebula/5"
                  : "border border-white/10 bg-white/5"
              } hover:border-orion-nebula/50 transition-all duration-300 h-full flex flex-col`}
            >
              {/* Card Content */}
              <div className="p-8 flex-grow flex flex-col">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-orion-nebula text-white px-3 py-1 rounded-full text-sm font-medium">
                      Plus populaire
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 font-spaceg">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-x-2 mb-4">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}€
                    </span>
                    <span className="text-gray-400">/mois</span>
                  </div>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-x-3">
                      <Check className="w-5 h-5 text-orion-nebula flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href="/app"
                  className={`block w-full text-center py-3 px-4 rounded-lg transition-colors mt-auto ${
                    plan.popular
                      ? "bg-orion-nebula hover:bg-orion-nebula/90 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-orion-nebula"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>

              {/* Gradient effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orion-nebula/0 via-orion-nebula/5 to-orion-nebula/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
