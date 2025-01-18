import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";

export default function ConditionsGeneralesDeVente() {
  const router = useRouter();

  return (
    <div className="bg-orion-dark-bg text-white min-h-screen">
      {/* Bouton de retour */}
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-indigo-500 transition duration-300 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Retour
        </button>
      </div>

      {/* Contenu des conditions générales de vente */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">
          Conditions générales de vente
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          Les présentes conditions générales régissent les ventes de services
          proposés par <strong>Flukx Studio</strong> pour son service{" "}
          <strong>Orion</strong>. En souscrivant à nos services, vous acceptez
          ces conditions.
        </p>
        <h2 className="text-xl font-semibold mb-2">Objet</h2>
        <p className="text-gray-400 text-sm mb-4">
          <strong>Orion</strong> est un service SaaS qui permet aux utilisateurs
          d&apos;accéder à des fonctionnalités avancées pour gérer leurs
          activités en ligne. Ces conditions régissent l&apos;accès à ces
          services.
        </p>
        <h2 className="text-xl font-semibold mb-2">Tarifs et paiements</h2>
        <p className="text-gray-400 text-sm mb-4">
          Les services sont proposés sur abonnement. Les tarifs sont disponibles
          sur notre page de tarification. Le paiement s&apos;effectue via{" "}
          <strong>Stripe</strong>, une plateforme de paiement sécurisée.
        </p>
        <h2 className="text-xl font-semibold mb-2">Résiliation</h2>
        <p className="text-gray-400 text-sm mb-4">
          Vous pouvez résilier votre abonnement à tout moment via votre compte
          utilisateur. La résiliation prendra effet à la fin de la période
          d&apos;abonnement en cours.
        </p>
      </div>
    </div>
  );
}
