/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { CreditCard, Bot, Zap } from "lucide-react";

const WhyOrion = () => {
  const comparisons = [
    {
      title: "Plusieurs Outils",
      description: "SEMRUSH, GTmetrix, Sucuri",
      price: "997€/mois",
      points: [
        "3 à 5 outils différents",
        "Configuration complexe",
        "Données techniques brutes",
        "Support lent par email",
      ],
    },
    {
      title: "Solution Orion",
      description: "Tout-en-un",
      price: "29€/mois",
      points: [
        "Interface unique intuitive",
        "Recommandations en SEO, Sécurité et Performance",
        "IA qui analyse et conseille",
        "Support mail 7j/7",
      ],
    },
  ];

  return (
    <section className="py-24 bg-orion-dark-bg relative">
      <div className="absolute inset-0" />

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
              Une seule solution pour tout gérer
            </span>
          </h2>
          <p className="text-lg text-gray-400">
            Fini les multiples outils complexes et coûteux
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div
                className={`h-full p-8 bg-white/[0.03] rounded-2xl border ${
                  index === 0
                    ? "border-white/5 hover:bg-white/[0.05]"
                    : "border-orion-nebula/20 hover:bg-white/[0.05]"
                } transition-all duration-300`}
              >
                <div className="flex items-center gap-4 mb-8">
                  {index === 0 ? (
                    <div className="p-3 rounded-xl bg-white/[0.05]">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                    </div>
                  ) : (
                    <img
                      src="/img/Logo 2.png"
                      alt="Orion Logo"
                      className="w-12 h-12 rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold text-white font-spaceg">
                      {item.title}
                    </h3>
                    <p
                      className={`text-lg font-spaceg ${index === 0 ? "text-gray-400" : "text-orion-nebula"}`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <div
                    className={`inline-block px-6 py-3 rounded-full ${
                      index === 0
                        ? "bg-white/[0.03] text-gray-300"
                        : "bg-orion-nebula/10 text-orion-nebula"
                    } font-semibold text-xl`}
                  >
                    {item.price}
                  </div>
                </div>

                <div className="space-y-4">
                  {item.points.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.2 + i * 0.1,
                      }}
                      className="flex items-center gap-3 text-lg"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          index === 0 ? "bg-gray-400" : "bg-orion-nebula"
                        }`}
                      />
                      <span className="text-gray-300">{point}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Hover border effect like in Features component */}
                <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-orion-nebula/20 transition-all duration-300" />
              </div>

              {index === 1 && (
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-orion-dark-bg/[0.7] px-6 py-3 rounded-full inline-flex items-center gap-2 border border-orion-nebula/20"
                  >
                    <Zap className="w-5 h-5 text-orion-nebula" />
                    <span className="text-gray-300 font-medium">
                      Économisez 968€ par mois
                    </span>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyOrion;
