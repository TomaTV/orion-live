import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";

export default function MentionsLegales() {
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

      {/* Contenu des mentions légales */}
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Mentions légales</h1>
        <p className="text-gray-400 text-sm mb-4">
          Les présentes mentions légales ont pour objectif de définir les
          modalités d&apos;utilisation du site <strong>Orion</strong>,
          accessible à l&apos;adresse {/* changer l'adresse */}
          <a href="https://www.orion.com" className="text-indigo-500">
            www.orion.com
          </a>
          .
        </p>
        {/* Faudra tout changer */}
        <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
        <p className="text-gray-400 text-sm mb-4">
          <strong>Orion</strong> est édité par la société{" "}
          <strong>Flukx Studio</strong>, SAS au capital de 10 000€.
        </p>
        <h2 className="text-xl font-semibold mb-2">Hébergeur du site</h2>
        <p className="text-gray-400 text-sm mb-4">
          Le site est hébergé par la société <strong>OVH</strong>, 2 rue
          Kellermann – 59100 Roubaix – France.
        </p>
        <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
        <p className="text-gray-400 text-sm mb-4">
          L&apos;ensemble des contenus présents sur ce site, y compris les
          textes, images, vidéos, logos et autres éléments, sont protégés par
          les droits d&apos;auteur et restent la propriété exclusive de{" "}
          <strong>Flukx Studio</strong> ou de ses partenaires.
        </p>
        <h2 className="text-xl font-semibold mb-2">Responsabilité</h2>
        <p className="text-gray-400 text-sm mb-4">
          <strong>Flukx Studio</strong> ne saurait être tenue responsable des
          dommages directs ou indirects résultant de l&apos;utilisation du site.
          L&apos;accès et l&apos;utilisation du site se font sous la seule
          responsabilité de l&apos;utilisateur.
        </p>
      </div>
    </div>
  );
}
