import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protection des routes /app
  if (pathname.startsWith("/app")) {
    const token = await getToken({ req });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Ajouter l'IP réelle aux headers
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             req.ip || 
             'unknown';

  const response = NextResponse.next();
  response.headers.set('x-real-ip', ip);

  return response;
}

export const config = {
  matcher: ['/app/:path*', '/api/auth/:path*']
};