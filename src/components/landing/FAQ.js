import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Comment Orion peut-il améliorer les performances de mon site ?",
    answer:
      "Orion analyse la vitesse de votre site et vous propose des recommandations pour optimiser la gestion des images, la mise en cache et la minification du code.",
  },
  {
    question: "Quelles sont les fonctionnalités de sécurité proposées ?",
    answer:
      "Orion détecte les vulnérabilités, les tentatives d'intrusion et les attaques DDoS, et propose des actions pour renforcer la sécurité de votre site.",
  },
  {
    question: "Comment fonctionne l'optimisation SEO d'Orion ?",
    answer:
      "Orion évalue vos contenus, la structure de votre site et vos backlinks pour fournir des recommandations détaillées et vous alerter en cas de changement significatif.",
  },
  {
    question: "Puis-je essayer Orion gratuitement ?",
    answer:
      "Oui, vous bénéficiez de 2 crédits gratuits à l'inscription pour tester nos outils sans engagement. Vous pouvez découvrir les fonctionnalités de base d'Orion sans frais.",
  },
  {
    question: "Est-il possible de changer de plan à tout moment ?",
    answer:
      "Oui, vous pouvez changer de plan à tout moment. Les modifications sont appliquées immédiatement et la facturation est ajustée en fonction de votre nouveau plan.",
  },
  {
    question: "Puis-je télécharger les rapports d'analyse ?",
    answer:
      "Oui, le téléchargement des rapports est inclus dans les plans Pro et Entreprise pour faciliter le suivi et l'archivage de vos analyses.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="relative py-24 bg-orion-dark-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-white mb-6 font-spaceg">
            Questions fréquentes
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tout ce que vous devez savoir pour bien démarrer avec Orion
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left"
              >
                <div className="p-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white pr-8">
                      {faq.question}
                    </h3>
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-orion-nebula flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-orion-nebula flex-shrink-0" />
                    )}
                  </div>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                          marginTop: "1rem",
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          marginTop: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          exit={{ y: -10 }}
                          className="text-gray-400"
                        >
                          {faq.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
