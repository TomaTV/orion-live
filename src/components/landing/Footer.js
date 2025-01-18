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
            href="mailto:support@orion.com" // Remplacez par votre adresse email contact
            className="text-gray-400 hover:text-indigo-500 transition duration-300 text-sm"
          >
            Support
          </Link>
        </div>

        {/* Section personnalisée (droite) */}
        <div className="flex items-center space-x-2 ml-auto">
          <p className="text-gray-400 text-sm">Paiements sécurisés avec</p>
          <Link
            href="https://stripe.com"
            target="_blank"
            className="text-indigo-500 hover:text-white transition duration-300 text-sm"
          >
            Stripe
          </Link>
        </div>
      </div>
    </footer>
  );
}
