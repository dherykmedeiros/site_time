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
      role: "ADMIN" | "PLAYER" | "COACH" | "MATERIAL_DIRECTOR";
      teamId: string | null;
      playerId: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "PLAYER" | "COACH" | "MATERIAL_DIRECTOR";
    teamId: string | null;
    playerId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "PLAYER" | "COACH" | "MATERIAL_DIRECTOR";
    teamId: string | null;
    playerId: string | null;
    lastRefreshed?: number;
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
          role: user.role as "ADMIN" | "PLAYER" | "COACH" | "MATERIAL_DIRECTOR",
          teamId: user.teamId,
          playerId: user.playerId,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.teamId = user.teamId;
        token.playerId = user.playerId;
        token.lastRefreshed = Date.now();
      }

      // Keep JWT claims fresh when user/team links change after login, with 60-second throttling TTL.
      const now = Date.now();
      const throttleMs = 60 * 1000;
      const lastRefreshed = token.lastRefreshed || 0;

      if (token.id && (now - lastRefreshed > throttleMs)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id },
            select: {
              email: true,
              name: true,
              role: true,
              teamId: true,
              playerId: true,
            },
          });

          if (dbUser) {
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.role = dbUser.role as "ADMIN" | "PLAYER" | "COACH" | "MATERIAL_DIRECTOR";
            token.teamId = dbUser.teamId;
            token.playerId = dbUser.playerId;
            token.lastRefreshed = now;
          }
        } catch (err) {
          console.error("[AUTH] JWT refresh failed:", err);
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
        playerId: token.playerId,
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

export async function requireCoachOrAdmin() {
  const { session, error } = await requireAuth();

  if (error) {
    return { error, session: null };
  }

  if (session!.user.role !== "ADMIN" && session!.user.role !== "COACH") {
    return {
      error: NextResponse.json(
        { error: "Acesso restrito a administradores ou comissão técnica" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { session: session!, error: null };
}

export async function requireMaterialDirectorOrAdmin() {
  const { session, error } = await requireAuth();

  if (error) {
    return { error, session: null };
  }

  if (session!.user.role !== "ADMIN" && session!.user.role !== "MATERIAL_DIRECTOR") {
    return {
      error: NextResponse.json(
        { error: "Acesso restrito a administradores ou diretores de material" },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { session: session!, error: null };
}
