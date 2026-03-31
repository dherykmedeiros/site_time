import { NextResponse } from "next/server";

function getEnv(name: string): string | undefined {
  const env =
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ??
    {};
  return env[name];
}

export async function GET() {
  const vapidPublicKey = getEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY");

  if (!vapidPublicKey) {
    return NextResponse.json({ configured: false, vapidPublicKey: null });
  }

  return NextResponse.json({ configured: true, vapidPublicKey });
}
