import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Sparkles, AlertTriangle, ArrowLeft } from "lucide-react";
import HeaderApp from "@/components/app/Header";
import Link from "next/link";

const creditPacks = {
  free: {
    credits: [
      { amount: 1, price: 2.5 },
      { amount: 5, price: 10.0, discount: 5 },
      { amount: 10, price: 18.0, discount: 10 },
      { amount: 20, price: 32.0, discount: 20, popular: true },
    ],
  },
  pro: {
    credits: [
      { amount: 1, price: 2.0 },
      { amount: 5, price: 8.0, discount: 5 },
      { amount: 10, price: 15.0, discount: 10 },
      { amount: 20, price: 28.0, discount: 30, popular: true },
    ],
  },
  enterprise: {
    credits: [
      { amount: 1, price: 1.8 },
      { amount: 5, price: 7.5, discount: 10 },
      { amount: 10, price: 14.0, discount: 15 },
      { amount: 20, price: 25.0, discount: 35, popular: true },
    ],
  },
  admin: {
    credits: [
      { amount: 1, price: 0 },
      { amount: 5, price: 0 },
      { amount: 10, price: 0 },
      { amount: 20, price: 0 },
    ],
  },
};

const RankTitles = {
  free: "Standard",
  pro: "Pro",
  enterprise: "Entreprise",
  admin: "Admin",
};

export default function PricingPage() {
  const { data: session, status } = useSession({ required: true });
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!session) return;
      try {
        const response = await fetch("/api/users/info");
        const data = await response.json();
        if (data.rank) {
          setUserRank(data.rank.toLowerCase());
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchUserInfo();
    }
  }, [session]);

  const handlePurchase = async () => {
    if (!selectedPack || processingPayment) return;
    setProcessingPayment(true);
    try {
      // TODO: Implémenter la logique de paiement
      console.log(
        `Achat de ${selectedPack.amount} crédits pour ${selectedPack.price}€`
      );
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (status === "loading" || loading || !userRank) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-orion-dark-bg">
        <HeaderApp />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orion-nebula"></div>
        </div>
      </div>
    );
  }

  const currentPackage = creditPacks[userRank] || creditPacks.free;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-orion-dark-bg">
      <HeaderApp />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/app"
            className="group mb-8 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Retour à l&apos;application</span>
          </Link>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orion-nebula/10 px-4 py-2 dark:bg-orion-nebula/20">
                <Sparkles className="h-4 w-4 text-orion-nebula" />
                <span className="text-sm font-medium text-orion-nebula">
                  Pack {RankTitles[userRank]}
                </span>
              </div>
              <h1 className="mb-4 font-spaceg text-4xl font-bold text-gray-900 dark:text-white">
                Recharger mes crédits
              </h1>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
                Choisissez le pack qui vous convient. Plus le pack est
                important, plus la réduction est avantageuse.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {currentPackage.credits.map((pack, index) => (
            <motion.div
              key={pack.amount}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                onClick={() => setSelectedPack(pack)}
                className={`group relative h-full cursor-pointer rounded-2xl border transition-all duration-300 ${
                  selectedPack?.amount === pack.amount
                    ? "border-orion-nebula bg-white/80 shadow-lg shadow-orion-nebula/5 dark:bg-white/10"
                    : "border-gray-200/50 bg-white/50 hover:border-orion-nebula/50 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[0.07]"
                }`}
              >
                {/* Popular tag */}
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block rounded-full bg-gradient-to-r from-orion-purple to-orion-nebula px-3 py-1 text-xs font-medium text-white shadow-lg">
                      Le plus populaire
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex h-full flex-col p-6">
                  {/* Crédits et Prix */}
                  <div className="text-center">
                    <div className="mb-4 flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {pack.amount} crédit{pack.amount > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="mb-4 space-y-1">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {pack.price.toFixed(2)}€
                      </span>
                      {pack.discount && (
                        <span className="block text-sm text-orion-nebula">
                          -{pack.discount}% de réduction
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => setSelectedPack(pack)}
                    className={`relative mt-auto w-full overflow-hidden rounded-xl py-2.5 text-sm font-medium transition-all duration-300 ${
                      selectedPack?.amount === pack.amount
                        ? "bg-orion-nebula text-white"
                        : "bg-gray-900/5 text-gray-900 hover:bg-orion-nebula hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-orion-nebula"
                    }`}
                  >
                    <div className="relative">
                      {selectedPack?.amount === pack.amount
                        ? "Sélectionné"
                        : "Sélectionner"}
                    </div>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-300 group-hover:translate-x-full group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer - Section Paiement */}
        {selectedPack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-12 flex flex-col items-center"
          >
            <div className="w-full max-w-md space-y-6">
              <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <div className="mb-6 flex items-center justify-between border-b border-gray-200/50 pb-4 dark:border-white/10">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPack.price.toFixed(2)}€
                  </span>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={processingPayment}
                  className="group relative w-full overflow-hidden rounded-xl bg-orion-nebula py-3 text-white transition-colors hover:bg-orion-purple disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    {processingPayment ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-b-white" />
                        <span>Traitement en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>
                          Acheter {selectedPack.amount} crédit
                          {selectedPack.amount > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </button>
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4 text-sm text-gray-500 dark:text-gray-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <p>
                  Les crédits achetés sont valables 30 jours et ne sont ni
                  remboursables ni transférables.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
