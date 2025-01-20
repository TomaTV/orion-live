import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import pool from "../../../lib/db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const userAgent = req.headers["user-agent"] || "unknown";
          const clientIp = req.headers["x-forwarded-for"] || 
                          req.socket?.remoteAddress || 
                          "::ffff:127.0.0.1";

          console.log('Login attempt:', { userAgent, clientIp });

          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-User-Agent": userAgent,
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Une erreur est survenue");
          }

          return data;
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }

      if (session?.user?.email) {
        try {
          const [users] = await pool.query(
            "SELECT id, email, credits, rank FROM users WHERE email = ?",
            [session.user.email]
          );

          if (users.length > 0) {
            session.user.credits = users[0].credits;
            session.user.rank = users[0].rank;
          }
        } catch (error) {
          console.error("Erreur session:", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);