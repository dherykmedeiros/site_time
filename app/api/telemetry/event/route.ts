import { NextResponse } from "next/server";
import { trackOperationalEvent } from "@/lib/telemetry";
import { telemetryEventSchema } from "@/lib/validations/telemetry";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalido", code: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const parsed = telemetryEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Campos invalidos",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const payload = parsed.data;
  if (payload.event === "recap_cta_clicked") {
    trackOperationalEvent(payload.event, {
      context: payload.context,
      ctaType: payload.ctaType,
      entityType: payload.entityType,
      entityId: payload.entityId,
    });
  } else {
    trackOperationalEvent(payload.event, {
      context: payload.context,
      entityType: payload.entityType,
      entityId: payload.entityId,
    });
  }

  return NextResponse.json({ ok: true });
}
