import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Permission, canUser } from "./permissions";
import { Role } from "@prisma/client";

export async function requirePermission(permission: Permission) {
  const session = await getSession();
  
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }),
    };
  }

  if (!session.user.role) {
    return {
      session: null,
      error: NextResponse.json({ error: "Papel não definido" }, { status: 403 }),
    };
  }

  const role = session.user.role as Role;
  const hasPermission = canUser(role, permission);

  if (!hasPermission) {
    return {
      session: null,
      error: NextResponse.json({ error: "Acesso negado: permissão insuficiente" }, { status: 403 }),
    };
  }

  return { session, error: null };
}

export async function requireTeamAccess(entityTeamId: string) {
  const session = await getSession();

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }),
    };
  }

  if (!session.user.teamId) {
    return {
      session: null,
      error: NextResponse.json({ error: "Time não definido" }, { status: 403 }),
    };
  }

  if (session.user.teamId !== entityTeamId) {
    return {
      session: null,
      error: NextResponse.json({ error: "Acesso negado: pertence a outro time" }, { status: 403 }),
    };
  }

  return { session, error: null };
}

export async function requireTeamMember() {
  const session = await getSession();

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }),
    };
  }

  if (!session.user.teamId) {
    return {
      session: null,
      error: NextResponse.json({ error: "Acesso negado: não é membro de um time" }, { status: 403 }),
    };
  }

  return { session, error: null };
}
