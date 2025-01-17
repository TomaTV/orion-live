import { NextResponse } from "next/server";

export function middleware(request) {
  const isAuthenticated = request.cookies.get("auth");
  const pathname = request.nextUrl.pathname;

  // Si l'utilisateur essaye d'accéder à /app/* sans être authentifié
  if (pathname.startsWith("/app") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si l'utilisateur est sur /login et est authentifié
  // Ajouter une vérification pour éviter la redirection si on vient de /app/pricing
  if (
    pathname === "/login" &&
    isAuthenticated &&
    !request.headers.get("referer")?.includes("/app/")
  ) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
