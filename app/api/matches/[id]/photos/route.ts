import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id: matchId } = await params;

    if (!session.user.teamId) {
      return NextResponse.json(
        { error: "Usuário não possui time vinculado" },
        { status: 400 }
      );
    }

    const photos = await prisma.matchPhoto.findMany({
      where: {
        matchId,
        teamId: session.user.teamId,
      },
      include: {
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
    console.error("[GET /api/matches/[id]/photos] Error:", err);
    return NextResponse.json(
      { error: "Falha ao buscar fotos da partida" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id: matchId } = await params;

    if (!session.user.teamId) {
      return NextResponse.json(
        { error: "Usuário não possui time vinculado" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo de imagem é obrigatório" },
        { status: 400 }
      );
    }

    // Call the application's existing /api/upload endpoint internally
    const urlObj = new URL(request.url);
    const uploadUrl = `${urlObj.protocol}//${urlObj.host}/api/upload`;
    
    const cookie = request.headers.get("cookie") || "";
    
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        cookie,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Erro ao fazer upload da imagem" },
        { status: uploadResponse.status }
      );
    }

    const { url } = await uploadResponse.json();

    const matchPhoto = await prisma.matchPhoto.create({
      data: {
        matchId,
        teamId: session.user.teamId,
        url,
        caption: caption || null,
        uploadedById: session.user.id,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(matchPhoto, { status: 201 });
  } catch (err) {
    console.error("[POST /api/matches/[id]/photos] Error:", err);
    return NextResponse.json(
      { error: "Falha ao enviar foto para a partida" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id: matchId } = await params;

    if (!session.user.teamId) {
      return NextResponse.json(
        { error: "Usuário não possui time vinculado" },
        { status: 400 }
      );
    }

    const urlObj = new URL(request.url);
    let photoId = urlObj.searchParams.get("photoId");

    if (!photoId) {
      try {
        const body = await request.json();
        photoId = body.photoId;
      } catch {}
    }

    if (!photoId) {
      return NextResponse.json(
        { error: "ID da foto é obrigatório" },
        { status: 400 }
      );
    }

    const photo = await prisma.matchPhoto.findFirst({
      where: { id: photoId, teamId: session.user.teamId },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Foto não encontrada" },
        { status: 404 }
      );
    }

    if (photo.matchId !== matchId || photo.teamId !== session.user.teamId) {
      return NextResponse.json(
        { error: "Foto não pertence a esta partida ou time" },
        { status: 400 }
      );
    }

    const isOwner = photo.uploadedById === session.user.id;
    const isStaff = session.user.role === "ADMIN" || session.user.role === "COACH";

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { error: "Acesso negado para excluir esta foto" },
        { status: 403 }
      );
    }

    await prisma.matchPhoto.delete({
      where: { id: photoId },
    });

    return NextResponse.json({ message: "Foto deletada com sucesso" });
  } catch (err) {
    console.error("[DELETE /api/matches/[id]/photos] Error:", err);
    return NextResponse.json(
      { error: "Falha ao deletar foto" },
      { status: 500 }
    );
  }
}
