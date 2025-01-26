import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";

export default function ConditionsUtilisation() {
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

      {/* Contenu des conditions d&apos;utilisation */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">
          Conditions d&apos;utilisation
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          En accédant et en utilisant nos services, vous acceptez les termes et
          conditions suivants.
        </p>

        <h2 className="text-xl font-semibold mb-2">Accès au service</h2>
        <p className="text-gray-400 text-sm mb-4">
          L&apos;accès à notre service est réservé aux utilisateurs inscrits et
          conformes aux conditions décrites ci-dessous.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          Comportement des utilisateurs
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          En utilisant notre service, vous vous engagez à respecter les lois en
          vigueur et à ne pas utiliser le service à des fins illégales ou
          nuisibles.
        </p>

        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p className="text-gray-400 text-sm mb-4">
          Tous les contenus présents sur notre plateforme sont protégés par des
          droits de propriété intellectuelle et ne peuvent être utilisés sans
          autorisation.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          Modification des conditions
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Nous nous réservons le droit de modifier ces conditions à tout moment.
          Les utilisateurs seront informés de ces changements par notification.
        </p>

        <h2 className="text-xl font-semibold mb-2">
          Limitation de responsabilité
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Nous ne pouvons être tenus responsables de tout dommage direct ou
          indirect résultant de l&apos;utilisation ou de l&apos;incapacité
          d&apos;utiliser nos services.
        </p>

        <h2 className="text-xl font-semibold mb-2">Droit applicable</h2>
        <p className="text-gray-400 text-sm mb-4">
          Ces conditions sont régies par la législation en vigueur dans le pays
          où l&apos;entreprise est enregistrée. Toute dispute sera soumise à la
          compétence des juridictions compétentes.
        </p>
      </div>
    </div>
  );
}
