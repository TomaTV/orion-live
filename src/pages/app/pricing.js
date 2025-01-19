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

function PricingPage() {
  const { data: session, status } = useSession({
    required: true,
  });
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
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

  if (status === "loading" || loading || !userRank) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-orion-dark-bg">
        <HeaderApp />
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orion-nebula"></div>
        </div>
      </div>
    );
  }

  const currentPackage = creditPacks[userRank] || creditPacks.free;

  const handlePurchase = async () => {
    if (!selectedPack || processingPayment) return;

    setProcessingPayment(true);
    try {
      // Logique de paiement à implémenter
      console.log(
        `Purchasing ${selectedPack.amount} credits for ${selectedPack.price}€`
      );

      // Exemple de logique de paiement :
      /*
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPack.amount,
          price: selectedPack.price,
          userId: session.user.id
        })
      });
      
      if (response.ok) {
        const { paymentUrl } = await response.json();
        window.location.href = paymentUrl;
      }
      */
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-orion-dark-bg">
      <HeaderApp />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/app"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l&apos;application
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-orion-nebula/10 dark:bg-orion-nebula/20 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-orion-nebula" />
            <span className="text-sm font-medium text-orion-nebula">
              Pack {RankTitles[userRank]}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 mb-2 font-spaceg">
            Recharger mes crédits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Sélectionnez le pack qui vous convient. Plus le pack est important,
            plus la réduction est avantageuse.
          </p>
        </motion.div>

        {/* Grille des packs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {currentPackage.credits.map((pack, index) => (
            <motion.div
              key={pack.amount}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                onClick={() => setSelectedPack(pack)}
                className={`
                  cursor-pointer relative w-full h-full p-4 rounded-xl transition-all duration-300 
                  ${
                    selectedPack?.amount === pack.amount
                      ? "bg-orion-nebula/10 dark:bg-orion-nebula/20 ring-2 ring-orion-nebula shadow-lg"
                      : "bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 hover:shadow-md"
                  }
                `}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-orion-nebula text-white text-xs px-3 py-1 rounded-full">
                      -{pack.discount}% inclus
                    </span>
                  </div>
                )}

                <div className="flex flex-col items-center pt-2">
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      {pack.amount} crédit{pack.amount > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {pack.price.toFixed(2)}€
                    </span>
                    {pack.discount && !pack.popular && (
                      <span className="text-sm text-orion-nebula bg-orion-nebula/10 px-2 py-0.5 rounded-full">
                        -{pack.discount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Effet de hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orion-nebula/0 via-orion-nebula/5 to-orion-nebula/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Paiement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          {selectedPack ? (
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-white/5 rounded-xl p-6 mb-4">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total à payer
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPack.price.toFixed(2)}€
                  </span>
                </div>
                <button
                  onClick={handlePurchase}
                  disabled={processingPayment}
                  className={`
                    w-full bg-orion-nebula hover:bg-orion-nebula/90 text-white py-3 rounded-lg font-medium
                    transition-colors relative overflow-hidden group
                    ${processingPayment ? "cursor-wait opacity-80" : ""}
                  `}
                >
                  {processingPayment ? (
                    <span className="inline-flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-b-white mr-2" />
                      Traitement en cours...
                    </span>
                  ) : (
                    <>
                      Acheter {selectedPack.amount} crédit
                      {selectedPack.amount > 1 ? "s" : ""}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400 text-sm bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/10">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                <p>
                  Les crédits achetés sont valables 30 jours et ne sont ni
                  remboursables ni transférables.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              Sélectionnez un pack pour continuer
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default PricingPage;
