import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useProtectedRoute() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && router.pathname.startsWith('/app')) {
      router.push('/login');
    }
    if (status === "authenticated" && router.pathname === '/login') {
      router.push('/app');
    }
  }, [status, router]);

  return { isLoading: status === "loading", session };
}