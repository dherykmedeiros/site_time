import { NextResponse } from "next/server";
import { z } from "zod";
import { validateWebhookSignature, processPixPayment } from "@/lib/webhook-pix";
import { trackOperationalEvent } from "@/lib/telemetry";
import { rateLimitMutation } from "@/lib/rate-limit";
import { extractClientIp } from "@/lib/request-ip";

const webhookSchema = z.object({
  externalId: z.string().min(1),
  amount: z.number().positive(),
  paidAt: z.string(),
});

export async function POST(request: Request) {
  const ip = extractClientIp(request);
  const rateLimit = await rateLimitMutation(ip);
  if (!rateLimit.allowed) {
    trackOperationalEvent("pix_webhook_rate_limit_exceeded", { ip });
    return NextResponse.json(
      { error: "Too many requests. Please try again later.", retryAfterMinutes: rateLimit.retryAfterMinutes },
      { status: 429 }
    );
  }

  const headerValue = request.headers.get("X-Webhook-Secret");
  if (!validateWebhookSignature(headerValue)) {
    trackOperationalEvent("pix_webhook_invalid_signature", { hasHeader: !!headerValue });
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parseResult = webhookSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Payload inválido", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const result = await processPixPayment(parseResult.data);
    if (!result.success) {
      const statusMap: Record<string, number> = {
        TRANSACTION_NOT_FOUND: 404,
        AMOUNT_MISMATCH: 400,
      };
      const status = statusMap[result.code] || 500;
      return NextResponse.json({ error: result.error, code: result.code }, { status });
    }

    return NextResponse.json({ success: true, transactionId: result.transactionId }, { status: 200 });
  } catch (error) {
    trackOperationalEvent("pix_webhook_internal_error", { error: String(error) });
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
