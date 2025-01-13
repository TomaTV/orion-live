import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useProtectedRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = () => {
    const isAuthenticated =
      typeof window !== "undefined" &&
      localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated && !router.pathname.includes("/login")) {
      router.push("/login");
    } else if (isAuthenticated && router.pathname === "/login") {
      router.push("/app");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isLoading };
}
