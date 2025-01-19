import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import HeaderApp from "@/components/app/Header";
import AdminOnly from "@/components/hooks/AdminOnly";

function AppPage() {
  const router = useRouter(); // On définit le router ici
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-orion-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orion-nebula"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-orion-dark-bg bg-gray-200/90">
      <HeaderApp />
      <AdminOnly>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-orion-nebula dark:text-orion-nebula light:text-orion-light-text font-spaceg">
            Tableau de bord
          </h1>
          <p className="text-lg text-orion-nebula dark:text-orion-nebula light:text-orion-light-text">
            Bienvenue sur votre tableau de bord, {session.user.email} !
          </p>
        </div>
      </AdminOnly>
    </div>
  );
}

export default AppPage;
