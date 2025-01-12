import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe, LineChart, Zap } from "lucide-react";

const tabs = [
  {
    icon: Globe,
    title: "1. Connectez votre site",
    description:
      "Ajoutez votre site en quelques clics. Orion commence immédiatement à analyser vos pages pour identifier les points d'amélioration.",
    video: "/videos/step-1.mp4",
  },
  {
    icon: LineChart,
    title: "2. Obtenez vos analyses",
    description:
      "Visualisez instantanément les performances, le SEO et la sécurité de votre site grâce à nos rapports détaillés et nos graphiques interactifs.",
    video: "/videos/step-1.mp4",
  },
  {
    icon: Zap,
    title: "3. Optimisez et améliorez",
    description:
      "Suivez nos recommandations personnalisées pour améliorer votre site. Chaque suggestion est accompagnée d'un guide étape par étape.",
    video: "/videos/step-1.mp4",
  },
];

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative py-24 bg-orion-dark-bg" id="howitworks">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-spaceg">
            Comment ça fonctionne ?
          </h2>
          <p className="text-lg text-gray-400">
            Optimisez votre site web en trois étapes simples
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Section Vidéo */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[16/11.3] rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <video
                    className="w-full h-full object-cover rounded-2xl"
                    autoPlay
                    loop
                    muted
                    src={tabs[activeTab].video}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative min-h-[450px]">
              <div className="space-y-4 absolute w-full">
                {tabs.map((tab, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <button
                        onClick={() => setActiveTab(index)}
                        className={`w-full text-left p-6 rounded-xl border ${
                          activeTab === index
                            ? "bg-white/10 border-orion-nebula"
                            : "bg-white/5 border-white/10 hover:bg-white/[0.07]"
                        } transition-colors duration-300 group`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-3 rounded-lg ${
                              activeTab === index
                                ? "bg-orion-nebula/20"
                                : "bg-white/5 group-hover:bg-white/10"
                            } transition-colors duration-300`}
                          >
                            <tab.icon
                              className={`w-6 h-6 ${
                                activeTab === index
                                  ? "text-orion-nebula"
                                  : "text-gray-400 group-hover:text-white"
                              } transition-colors duration-300`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`text-lg font-medium ${
                                activeTab === index
                                  ? "text-orion-nebula"
                                  : "text-white group-hover:text-orion-nebula"
                              } transition-colors duration-300`}
                            >
                              {tab.title}
                            </h3>
                          </div>
                        </div>
                        <AnimatePresence mode="wait">
                          {activeTab === index && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                opacity: { duration: 0.1 },
                                height: { duration: 0.1 },
                              }}
                              className="text-gray-400 leading-relaxed ml-[3.75rem] mt-4 overflow-hidden"
                            >
                              {tab.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
