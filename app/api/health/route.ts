import { NextResponse } from "next/server";
import { rateLimitRead } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const { allowed } = await rateLimitRead(ip);

  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return NextResponse.json({
    status: "ok",
    service: "site-time",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
