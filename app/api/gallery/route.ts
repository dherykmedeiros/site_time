import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    if (!session.user.teamId) {
      return NextResponse.json(
        { error: "Usuário não possui time vinculado" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get("matchId");

    const whereClause: any = {
      teamId: session.user.teamId,
    };

    if (matchId) {
      whereClause.matchId = matchId;
    }

    const photos = await prisma.matchPhoto.findMany({
      where: whereClause,
      include: {
        match: {
          select: {
            id: true,
            opponent: true,
            date: true,
          },
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(photos);
  } catch (err) {
    console.error("[GET /api/gallery] Error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar fotos da galeria" },
      { status: 500 }
    );
  }
}
