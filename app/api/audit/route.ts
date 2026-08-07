import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { withErrorHandler } from "@/lib/api-handler";

// GET /api/audit — List administrative audit logs (ADMIN only)
export const GET = withErrorHandler(async (request: Request) => {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const teamId = session.user.teamId;
  if (!teamId) {
    return NextResponse.json({ error: "Usuário não possui time vinculado" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const requestedTeamId = searchParams.get("teamId");
  if (requestedTeamId && requestedTeamId !== teamId) {
    return NextResponse.json({ error: "Acesso negado para trilha de auditoria de outra equipe" }, { status: 403 });
  }

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const action = searchParams.get("action");
  const skip = (page - 1) * limit;

  const whereCondition: any = { teamId };
  if (action) {
    whereCondition.action = action;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
    }),
    prisma.auditLog.count({
      where: whereCondition,
    }),
  ]);

  return NextResponse.json({
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
