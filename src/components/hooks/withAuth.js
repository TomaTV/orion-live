import { useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "./useProtectedRoute";

export default function withAuth(WrappedComponent) {
  return function ProtectedRoute(props) {
    const { isLoading } = useProtectedRoute();

    if (isLoading) {
      return (
        <div className="min-h-screen bg-orion-dark-bg flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orion-nebula"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
