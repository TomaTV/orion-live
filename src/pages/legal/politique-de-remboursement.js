import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";

export default function PolitiqueDeRemboursement() {
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

      {/* Contenu de la politique de remboursement */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Politique de remboursement</h1>
        <p className="text-gray-400 text-sm mb-4">
          Nous n&apos;offrons pas de remboursement pour les services souscrits
          sur notre plateforme. Une fois que vous avez payé pour un abonnement,
          il n&apos;est pas possible de demander un remboursement, quelle que
          soit la situation.
        </p>
        <h2 className="text-xl font-semibold mb-2">Exceptions</h2>
        <p className="text-gray-400 text-sm mb-4">
          Si vous rencontrez un problème majeur avec notre service, contactez
          notre support pour une résolution possible. Nous nous efforçons de
          garantir une expérience utilisateur optimale.
        </p>
      </div>
    </div>
  );
}
