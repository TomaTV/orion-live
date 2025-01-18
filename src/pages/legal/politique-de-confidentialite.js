import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";

export default function PolitiqueDeConfidentialite() {
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

      {/* Contenu de la politique de confidentialité */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">
          Politique de confidentialité
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          La présente politique de confidentialité décrit comment{" "}
          <strong>Flukx Studio</strong> collecte, utilise, et protège les
          données personnelles des utilisateurs de son service{" "}
          <strong>Orion</strong>.
        </p>
        <h2 className="text-xl font-semibold mb-2">Données collectées</h2>
        <p className="text-gray-400 text-sm mb-4">
          Nous collectons des données personnelles telles que : nom, prénom,
          adresse e-mail, et informations de paiement lorsque vous vous
          inscrivez ou utilisez nos services.
        </p>
        <h2 className="text-xl font-semibold mb-2">Utilisation des données</h2>
        <p className="text-gray-400 text-sm mb-4">
          Les données collectées sont utilisées pour fournir nos services, vous
          envoyer des informations sur nos produits, et améliorer
          l&apos;expérience utilisateur.
        </p>
        <h2 className="text-xl font-semibold mb-2">Sécurité des données</h2>
        <p className="text-gray-400 text-sm mb-4">
          Nous mettons en œuvre des mesures de sécurité appropriées pour
          protéger vos données contre toute perte, altération ou accès non
          autorisé.
        </p>
        <h2 className="text-xl font-semibold mb-2">Droits des utilisateurs</h2>
        <p className="text-gray-400 text-sm mb-4">
          Vous avez le droit d&apos;accéder, de rectifier, de supprimer ou de
          limiter le traitement de vos données personnelles à tout moment en
          nous contactant.
        </p>
      </div>
    </div>
  );
}
