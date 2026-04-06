import { NextResponse } from "next/server";
import { trackOperationalEvent } from "@/lib/telemetry";
import { telemetryEventSchema } from "@/lib/validations/telemetry";
import { rateLimitTelemetry } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

export async function POST(request: Request) {
  const ip = extractClientIp(request);
  const { allowed, retryAfterMinutes } = await rateLimitTelemetry(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: `Rate limited. Tente em ${retryAfterMinutes} minutos.`, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

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
