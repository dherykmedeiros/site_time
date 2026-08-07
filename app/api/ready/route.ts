import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitRead } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const { allowed } = await rateLimitRead(ip);

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    // Ping database safely
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Readiness Check Failed]:", error);
    return NextResponse.json(
      {
        status: "unready",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
