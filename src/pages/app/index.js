import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import HeaderApp from "@/components/app/Header";

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
      <div className="min-h-screen bg-orion-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orion-nebula"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orion-dark-bg">
      <HeaderApp />
    </div>
  );
}

export default AppPage;
