import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    app: "site-time",
    version: "1.0.0",
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "b3aa85f",
    environment: process.env.NODE_ENV || "production",
    branch: process.env.VERCEL_GIT_COMMIT_REF || "003-sports-team-mgmt",
    deployedAt: new Date().toISOString(),
  });
}
