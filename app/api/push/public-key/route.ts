import { NextResponse } from "next/server";

export async function GET() {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!vapidPublicKey) {
    return NextResponse.json({ configured: false, vapidPublicKey: null });
  }

  return NextResponse.json({ configured: true, vapidPublicKey });
}
