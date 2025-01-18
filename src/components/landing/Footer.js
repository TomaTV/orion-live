import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-orion-dark-bg py-6 text-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo et Copyright (gauche) */}
        <div className="flex items-center space-x-3">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Orion. Tous droits réservés.
          </p>
        </div>

        {/* Liens légaux (centre) */}
        <div className="flex justify-center space-x-6 mx-auto">
          <Link
            href="/legal/mentions-legales"
            className="text-gray-400 hover:text-indigo-500 transition duration-300 text-sm"
          >
            Mentions légales
          </Link>
          <Link
            href="/legal/politique-de-confidentialite"
            className="text-gray-400 hover:text-indigo-500 transition duration-300 text-sm"
          >
            Politique de confidentialité
          </Link>
          <Link
            href="/legal/conditions-generales-de-vente"
            className="text-gray-400 hover:text-indigo-500 transition duration-300 text-sm"
          >
            Conditions générales de vente
          </Link>
          <Link
            href="/legal/politique-de-remboursement"
            className="text-gray-400 hover:text-indigo-500 transition duration-300 text-sm"
          >
            Politique de remboursement
          </Link>
          <Link
            href="mailto:support@orion.com"
            className="text-gray-400 hover:text-indigo-500 transition duration-300 text-sm"
          >
            Support
          </Link>
        </div>

        {/* Section des logos de paiement (droite) */}
        <div className="flex items-center space-x-4 ml-auto">
          <p className="text-gray-400 text-sm">Paiements sécurisés avec</p>
          <div className="flex space-x-3">
            <Link href="https://www.stripe.com" target="_blank">
              <Image
                src="/img/buy/stripe.svg" // Assure-toi de télécharger ces images dans le dossier public/images
                alt="Stripe"
                width={40}
                height={40}
              />
            </Link>
            <Link href="https://www.paypal.com" target="_blank">
              <Image
                src="/img/buy/paypal.svg" // Assure-toi de télécharger ces images dans le dossier public/images
                alt="PayPal"
                width={40}
                height={40}
              />
            </Link>
            <Link href="https://www.visa.com" target="_blank">
              <Image
                src="/img/buy/visa.svg"
                alt="Visa"
                width={40}
                height={40}
              />
            </Link>
            <Link href="https://www.mastercard.com" target="_blank">
              <Image
                src="/img/buy/mastercard.svg"
                alt="MasterCard"
                width={40}
                height={40}
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
