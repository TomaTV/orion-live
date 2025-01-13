import { NextResponse } from "next/server";

export function middleware(request) {
  const isAuthenticated = request.cookies.get("auth");

  if (request.nextUrl.pathname.startsWith("/app") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
