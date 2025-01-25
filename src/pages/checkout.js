import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-orion-dark-bg py-12">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Order Summary */}
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            {selectedPlan.name}
          </h1>
          <p className="text-2xl font-medium text-orion-nebula mb-8">
            {selectedPlan.price}€/mois
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <p className="text-lg text-white">{selectedPlan.name}</p>
              <p className="text-lg text-white">{selectedPlan.price}€</p>
            </div>
            <div className="flex justify-between items-center py-4 border-t border-b border-white/10">
              <p className="text-white">Subtotal</p>
              <p className="text-white">{selectedPlan.price}€</p>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-white/10">
              <div>
                <label
                  htmlFor="promoCode"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Promo Code
                </label>
                <input
                  id="promoCode"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="border border-white/10 bg-black/20 text-white rounded-md py-2 px-3"
                />
              </div>
              <button className="text-orion-nebula hover:text-orion-light-blue transition-colors">
                Apply
              </button>
            </div>
            <div className="flex justify-between py-4 border-b border-white/10">
              <p className="text-white">TVA</p>
              <p className="text-white">
                {(selectedPlan.price * 0.2).toFixed(2)}€
              </p>
            </div>
            <div className="flex justify-between items-center pt-4">
              <p className="text-lg text-white font-medium">Total</p>
              <p className="text-2xl font-bold text-orion-nebula">
                {(selectedPlan.price * 1.2).toFixed(2)}€
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Checkout</h2>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Contact Information
              </h3>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-white/10 bg-black/20 text-white rounded-md py-2 px-3"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Payment Method
              </h3>
              {/* Stripe Elements Placeholder */}
              <div className="bg-black/20 rounded-md p-4">
                <p className="text-white mb-4">Stripe Credit Card Form</p>
                <div className="border border-white/10 rounded-md py-2 px-3 mb-2">
                  <p className="text-white">Card Number</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-white/10 rounded-md py-2 px-3">
                    <p className="text-white">MM / YY</p>
                  </div>
                  <div className="border border-white/10 rounded-md py-2 px-3">
                    <p className="text-white">CVC</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-white mb-1"
              >
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-white/10 bg-black/20 text-white rounded-md py-2 px-3"
              />
            </div>
          </div>

          <motion.button
            className="mt-8 rounded-lg bg-orion-nebula text-white text-lg font-medium px-6 py-3 w-full"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-center items-center gap-2">
              <CreditCard className="w-6 h-6" />
              <span>Pay {(selectedPlan.price * 1.2).toFixed(2)}€</span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
