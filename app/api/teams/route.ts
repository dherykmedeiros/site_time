import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import { createTeamSchema, updateTeamSchema } from "@/lib/validations/team";

// POST /api/teams — Create team (ADMIN only)
export async function POST(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  // Check if admin already has a team
  if (session.user.teamId) {
    return NextResponse.json(
      { error: "Admin já possui um time", code: "TEAM_EXISTS" },
      { status: 409 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = createTeamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { name, shortName, description, primaryColor, secondaryColor, defaultVenue, badgeUrl } =
    parsed.data;

  const slug = generateSlug(name);

  // Check slug uniqueness
  const existingTeam = await prisma.team.findUnique({ where: { slug } });
  if (existingTeam) {
    return NextResponse.json(
      { error: "Slug gerado já existe", code: "SLUG_CONFLICT" },
      { status: 409 }
    );
  }

  // Create team and link to admin user in a transaction
  const team = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const newTeam = await tx.team.create({
      data: {
        name,
        shortName: shortName?.toUpperCase() ?? null,
        slug,
        description: description ?? null,
        primaryColor: primaryColor ?? null,
        secondaryColor: secondaryColor ?? null,
        defaultVenue: defaultVenue ?? null,
        badgeUrl: badgeUrl ?? null,
      },
    });

    await tx.user.update({
      where: { id: session.user.id },
      data: { teamId: newTeam.id },
    });

    return newTeam;
  });

  return NextResponse.json(
    {
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      slug: team.slug,
      description: team.description,
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      defaultVenue: team.defaultVenue,
      badgeUrl: team.badgeUrl,
      createdAt: team.createdAt.toISOString(),
    },
    { status: 201 }
  );
}

// GET /api/teams — Get authenticated user's team data
export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  const team = await prisma.team.findUnique({
    where: { id: session.user.teamId },
    include: {
      _count: {
        select: {
          players: true,
          matches: true,
        },
      },
    },
  });

  if (!team) {
    return NextResponse.json(
      { error: "Time não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: team.id,
    name: team.name,
    shortName: team.shortName,
    slug: team.slug,
    badgeUrl: team.badgeUrl,
    description: team.description,
    primaryColor: team.primaryColor,
    secondaryColor: team.secondaryColor,
    defaultVenue: team.defaultVenue,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
    _count: team._count,
  });
}

// PATCH /api/teams — Update team settings (ADMIN only)
export async function PATCH(request: Request) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (!session.user.teamId) {
    return NextResponse.json(
      { error: "Usuário não possui time vinculado" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = updateTeamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos inválidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.shortName !== undefined) updateData.shortName = data.shortName ? data.shortName.toUpperCase() : null;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.primaryColor !== undefined) updateData.primaryColor = data.primaryColor;
  if (data.secondaryColor !== undefined) updateData.secondaryColor = data.secondaryColor;
  if (data.defaultVenue !== undefined) updateData.defaultVenue = data.defaultVenue;
  if (data.badgeUrl !== undefined) updateData.badgeUrl = data.badgeUrl;

  // If name changed, regenerate slug and check uniqueness
  if (data.name) {
    const newSlug = generateSlug(data.name);
    const existingTeam = await prisma.team.findUnique({
      where: { slug: newSlug },
    });

    if (existingTeam && existingTeam.id !== session.user.teamId) {
      return NextResponse.json(
        { error: "Novo slug gerado conflita", code: "SLUG_CONFLICT" },
        { status: 409 }
      );
    }

    updateData.slug = newSlug;
  }

  const team = await prisma.team.update({
    where: { id: session.user.teamId },
    data: updateData,
    include: {
      _count: {
        select: {
          players: true,
          matches: true,
        },
      },
    },
  });

  return NextResponse.json({
    id: team.id,
    name: team.name,
    shortName: team.shortName,
    slug: team.slug,
    badgeUrl: team.badgeUrl,
    description: team.description,
    primaryColor: team.primaryColor,
    secondaryColor: team.secondaryColor,
    defaultVenue: team.defaultVenue,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
    _count: team._count,
  });
}
