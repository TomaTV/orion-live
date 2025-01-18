import { useSession } from "next-auth/react";

export default function AdminOnly({ children }) {
  const { data: session } = useSession();

  if (session?.user?.rank !== "admin") {
    return null;
  }

  return children;
}
