import { getSession } from "next-auth/react";

export const withAdmin = (handler) => {
  return async (req, res) => {
    const session = await getSession({ req });

    if (!session?.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Vérification du rang admin
    if (session.user.rank !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès réservé aux administrateurs" });
    }

    return handler(req, res);
  };
};
