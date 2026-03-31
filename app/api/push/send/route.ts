import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sendPushToUser } from "@/lib/push";
import { pushSendSchema } from "@/lib/validations/push";

// POST /api/push/send (internal/admin)
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const parsed = pushSendSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload inválido", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { userId, title, body: message, url, tag } = parsed.data;
  const result = await sendPushToUser(userId, { title, body: message, url, tag });

  return NextResponse.json({ ok: true, ...result });
}
