import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "ADMIN" | "PLAYER";
      teamId: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "PLAYER";
    teamId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "PLAYER";
    teamId: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as "ADMIN" | "PLAYER",
          teamId: user.teamId,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.teamId = user.teamId;
      }

      // Keep JWT claims fresh when user/team links change after login.
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: {
              email: true,
              name: true,
              role: true,
              teamId: true,
            },
          });

          if (dbUser) {
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.role = dbUser.role;
            token.teamId = dbUser.teamId;
          }
        } catch {
          // Keep last known claims if DB is temporarily unavailable.
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        teamId: token.teamId,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// ─── Auth Helpers (T011) ───────────────────────────────────

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      ),
      session: null,
    };
  }

  return { session, error: null };
}

export async function requireAdmin() {
  const { session, error } = await requireAuth();

  if (error) {
    return { error, session: null };
  }

  if (session!.user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Acesso restrito a administradores" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { session: session!, error: null };
}
