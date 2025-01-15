import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Gratuit",
    price: "0",
    credits: "2 crédits offerts à l'inscription, pas de crédits récurrents",
    description:
      "Testez Orion sans engagement. Explorez nos outils et effectuez vos premières analyses gratuitement.",
    features: [
      "Analyse de performance basique",
      "1 site pour les audits",
      "Recommandations simples",
    ],
    cta: "Démarrer gratuitement",
    popular: false,
  },
  {
    name: "Pro",
    price: "29",
    credits: "5 crédits par mois inclus (non cumulables)",
    description:
      "Accédez à des analyses avancées, optimisez votre SEO et gérez jusqu'à 5 sites pour un suivi complet.",
    features: [
      "Analyse de performance complète",
      "Audit SEO approfondi",
      "Jusqu'à 5 sites pour les audits",
      "Recommandations détaillées",
      "Téléchargement des rapports",
    ],
    cta: "Passer au plan Pro",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "99",
    credits: "15 crédits par mois inclus (non cumulables)",
    description:
      "La solution idéale pour les entreprises. Avec une analyse avancées et des rapports détaillés.",
    features: [
      "Tout du plan Pro, plus des fonctions avancées",
      "Analyse sécurité et accessibilité",
      "Statistiques historiques (90 jours)",
      "Recommandations en sécurité",
      "Support prioritaire",
      "Rapports exclusifs de performance",
      "Téléchargement complet des rapports",
    ],
    cta: "Contacter l'équipe",
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
          className="text-center mb-8"
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
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.3,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="relative group"
            >
              <div
                className={`${
                  plan.popular
                    ? "border-2 border-orion-nebula bg-orion-nebula/5"
                    : "border border-white/10 bg-white/5"
                } hover:border-orion-nebula/50 transition-all duration-300 rounded-2xl h-full flex flex-col`}
              >
                <div className="p-8 flex-grow flex flex-col">
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-orion-nebula text-white px-3 py-1 rounded-full text-sm font-medium font-spaceg">
                        Plus populaire
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2 font-spaceg">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-x-2 mb-4">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}€
                      </span>
                      {plan.price !== "0" && (
                        <span className="text-gray-400">/mois</span>
                      )}
                    </div>
                    <p className="text-lg font-medium text-orion-nebula mb-4">
                      {plan.credits}
                    </p>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-x-3"
                      >
                        <Check className="w-5 h-5 text-orion-nebula flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={
                      plan.price === "0"
                        ? "/app"
                        : plan.price === "99"
                          ? "/contact"
                          : "/checkout"
                    }
                    className={`block w-full text-center py-3 px-4 rounded-lg transition-colors mt-auto ${
                      plan.popular
                        ? "bg-orion-nebula hover:bg-orion-nebula/90 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-orion-nebula"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orion-nebula/0 via-orion-nebula/5 to-orion-nebula/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
