import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamSlug, name, contact, position, message } = body;

    if (!teamSlug || !name || !contact) {
      return NextResponse.json(
        { error: "Nome, contato e time são obrigatórios" },
        { status: 400 }
      );
    }

    const team = await prisma.team.findUnique({
      where: { slug: teamSlug },
      select: { id: true, publicDirectoryOptIn: true },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Time não encontrado" },
        { status: 404 }
      );
    }

    if (!team.publicDirectoryOptIn) {
      return NextResponse.json(
        { error: "O recrutamento para esta equipe não está aberto publicamente" },
        { status: 403 }
      );
    }

    const recruitment = await prisma.recruitmentRequest.create({
      data: {
        teamId: team.id,
        name,
        contact,
        position: position || null,
        message: message || null,
      },
    });

    return NextResponse.json(recruitment, { status: 201 });
  } catch (err) {
    console.error("[POST /api/recruitment] Error:", err);
    return NextResponse.json(
      { error: "Erro ao registrar solicitação de recrutamento" },
      { status: 500 }
    );
  }
}
