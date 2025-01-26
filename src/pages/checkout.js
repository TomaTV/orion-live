import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

const plans = [
  {
    name: "Pro",
    price: 29,
    description: "Pour les professionnels qui veulent des analyses avancées.",
  },
  {
    name: "Entreprise",
    price: 79,
    description:
      "Pour les entreprises qui ont besoin de fonctionnalités exclusives.",
  },
];

export default function Checkout() {
  const router = useRouter();
  const { plan: planName } = router.query;
  const selectedPlan = plans.find((p) => p.name === planName) || plans[0];

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  const paymentMethods = [
    { id: "card", name: "Carte bancaire", icon: CreditCard },
    {
      id: "apple",
      name: "Apple Pay",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.0757 12.3275C17.0649 10.8276 18.2542 9.9321 18.3093 9.89623C17.6132 8.87495 16.5146 8.7135 16.1406 8.69931C15.1944 8.59541 14.2764 9.24618 13.7941 9.24618C13.2977 9.24618 12.5451 8.71208 11.7464 8.72911C10.6914 8.74614 9.71162 9.33578 9.16665 10.2525C8.03567 12.1265 8.87362 14.8983 9.95744 16.3699C10.4964 17.0888 11.1261 17.8893 11.9602 17.8617C12.7668 17.8291 13.0844 17.3457 14.0582 17.3457C15.0178 17.3457 15.3213 17.8617 16.1687 17.842C17.0444 17.8291 17.5898 17.1129 18.1146 16.387C18.7259 15.5499 18.9863 14.7426 19 14.7071C18.9863 14.6858 17.0898 13.9314 17.0757 12.3275Z" />
          <path d="M15.5611 7.47695C16.0153 6.91683 16.3247 6.15772 16.2517 5.38672C15.5987 5.41947 14.7776 5.8459 14.3025 6.38463C13.8871 6.85439 13.5138 7.65021 13.6008 8.38657C14.3303 8.44795 15.0789 8.0285 15.5611 7.47695Z" />
        </svg>
      ),
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21.2768 10.856C21.4704 11.532 21.6 12.252 21.6 13.056C21.6 16.404 19.404 18.672 16.2 18.672C12.996 18.672 10.8 16.404 10.8 13.2C10.8 9.996 12.996 7.8 16.2 7.8C17.736 7.8 19.008 8.352 19.992 9.336L18.456 10.872C17.808 10.224 17.088 9.864 16.2 9.864C14.232 9.864 12.72 11.448 12.72 13.2C12.72 14.952 14.232 16.536 16.2 16.536C17.952 16.536 19.044 15.588 19.332 14.52H16.2V12.528H21.18C21.216 12.888 21.2768 13.176 21.2768 10.856Z" />
          <path d="M8.4 16.2H6.48V9H8.4V16.2Z" />
          <path d="M4.56 16.2H2.64V9H4.56V16.2Z" />
        </svg>
      ),
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.7831 7.24224C20.8388 6.95598 20.8668 6.66134 20.8668 6.36149C20.8668 4.47119 19.2643 2.87988 17.2874 2.87988H9.87007C9.67298 2.87988 9.50021 3.01347 9.44469 3.19761L6.04106 15.8561C6.00718 15.9786 6.096 16.1016 6.22707 16.1016H9.70825L10.582 11.8889L10.5576 12.0119C10.6132 11.8277 10.7847 11.6954 10.983 11.6954H12.663C15.8549 11.6954 18.3371 10.0516 19.1048 6.46345C19.0878 6.52397 19.7804 6.80089 20.7831 7.24224Z" />
          <path d="M11.2133 7.00769C11.2387 6.93294 11.2981 6.87242 11.3734 6.83775C11.4095 6.82352 11.4496 6.81563 11.4896 6.81563H16.4223C16.8173 6.81563 17.1927 6.85819 17.5438 6.94717C17.6839 6.98184 17.8192 7.02439 17.9484 7.07547C18.1844 7.17234 18.4036 7.28765 18.6035 7.42558C18.7425 7.25566 18.8595 7.07547 18.9565 6.88217C17.7374 5.72097 15.7073 5.2002 13.4376 5.2002H7.54807C7.33374 5.2002 7.14496 5.3491 7.086 5.5556L3.57749 18.5311C3.54017 18.6674 3.64623 18.8019 3.79007 18.8019H7.06261L8.88428 10.3702L11.2133 7.00769Z" />
        </svg>
      ),
    },
  ];

  const handlePromoCode = async () => {
    if (!promoCode || promoApplied) return;

    try {
      const response = await fetch("/api/checkout/verify-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setPromoDiscount(data.discount_percentage);
        setPromoApplied(true);
        setPromoError("");
      } else {
        setPromoError(data.message);
      }
    } catch (error) {
      setPromoError("Erreur lors de la vérification du code");
    }
  };

  const total = selectedPlan.price;
  const tva = total * 0.2;
  const discount = promoApplied ? total * (promoDiscount / 100) : 0;
  const finalTotal = (total + tva - discount).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orion-dark-bg to-black/90">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mb-12"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Retour à l&apos;application</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Plan Details */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-orion-nebula/10 dark:bg-orion-nebula/20 px-4 py-2 rounded-full mb-4">
                <Check className="w-4 h-4 text-orion-nebula" />
                <span className="text-sm font-medium text-orion-nebula">
                  Plan {selectedPlan.name}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Finaliser l&apos;abonnement
              </h1>
              <p className="text-gray-400">{selectedPlan.description}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                  <div>
                    <p className="text-white font-medium">
                      {selectedPlan.name}
                    </p>
                    <p className="text-sm text-gray-400">Abonnement mensuel</p>
                  </div>
                  <p className="text-white font-medium">
                    {selectedPlan.price}€
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      placeholder="Code promo"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orion-nebula/50"
                    />
                    {promoError && (
                      <p className="mt-1 text-sm text-red-500">{promoError}</p>
                    )}
                  </div>
                  <button
                    onClick={handlePromoCode}
                    disabled={!promoCode || promoApplied}
                    className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                      promoApplied
                        ? "bg-green-500/10 text-green-500 cursor-default"
                        : "bg-orion-nebula/10 text-orion-nebula hover:bg-orion-nebula/20"
                    }`}
                  >
                    {promoApplied ? "Appliqué" : "Appliquer"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Sous-total</span>
                    <span className="text-white">{total}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">TVA (20%)</span>
                    <span className="text-white">{tva.toFixed(2)}€</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">
                        Réduction ({promoDiscount}%)
                      </span>
                      <span className="text-green-400">
                        -{discount.toFixed(2)}€
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-black/20 p-6 flex justify-between items-center">
                <span className="text-white font-medium">Total</span>
                <span className="text-xl font-bold text-orion-nebula">
                  {finalTotal}€
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Form */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-6 space-y-6">
              {/* Contact */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Contact</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orion-nebula/50"
                      placeholder="vous@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Téléphone{" "}
                      <span className="text-gray-500">(Optionnel)</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orion-nebula/50"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Mode de paiement
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedPaymentMethod === method.id
                            ? "bg-orion-nebula/10 border-orion-nebula"
                            : "bg-black/20 border-white/10 hover:border-orion-nebula/50"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                        <span className="text-white">{method.name}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedPaymentMethod === "card" && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-black/20 border border-white/10 rounded-xl p-3">
                      <p className="text-white">Numéro de carte</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 border border-white/10 rounded-xl p-3">
                        <p className="text-white">MM / AA</p>
                      </div>
                      <div className="bg-black/20 border border-white/10 rounded-xl p-3">
                        <p className="text-white">CVC</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pay Button */}
            <motion.button
              className="w-full bg-orion-nebula hover:bg-orion-purple text-white font-medium px-8 py-4 rounded-xl transition-colors relative overflow-hidden group"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative flex justify-center items-center gap-3">
                <CreditCard className="w-5 h-5" />
                <span>Payer {finalTotal}€</span>
              </div>
            </motion.button>

            <p className="text-center text-sm text-gray-400">
              En procédant au paiement, vous acceptez nos{" "}
              <Link
                href="/legal/condition-utilisation"
                className="text-orion-nebula hover:text-orion-purple"
              >
                Conditions d&apos;utilisation
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
