import { prisma } from "@/lib/prisma";
import { trackOperationalEvent } from "@/lib/telemetry";

export interface PixWebhookPayload {
  externalId: string;
  amount: number;
  paidAt: string; // ISO date string
}

export type PixPaymentResult =
  | { success: true; transactionId: string }
  | { success: false; error: string; code: "TRANSACTION_NOT_FOUND" | "AMOUNT_MISMATCH" | "ALREADY_PAID" };

/**
 * Validates the webhook signature against the configured secret.
 */
export function validateWebhookSignature(headerValue: string | null): boolean {
  const secret = process.env.WEBHOOK_PIX_SECRET;
  if (!secret || !headerValue) {
    return false;
  }
  return headerValue === secret;
}

/**
 * Processes the PIX webhook payload to approve a transaction and its linked payments.
 */
export async function processPixPayment(payload: PixWebhookPayload): Promise<PixPaymentResult> {
  const { externalId, amount, paidAt } = payload;

  const transaction = await prisma.transaction.findUnique({
    where: { externalId },
    include: {
      membershipPayment: true,
      matchPayment: true,
    },
  });

  if (!transaction) {
    return { success: false, error: "Transação não encontrada", code: "TRANSACTION_NOT_FOUND" };
  }

  // Idempotency: if already paid, just return success
  if (transaction.status === "PAID") {
    return { success: true, transactionId: transaction.id };
  }

  // Value comparison with floating point tolerance
  const txAmount = Number(transaction.amount);
  if (Math.abs(txAmount - amount) > 0.01) {
    return { success: false, error: "Valor pago divergente do valor registrado", code: "AMOUNT_MISMATCH" };
  }

  // Update in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.transaction.update({
      where: { id: transaction.id },
      data: { status: "PAID" },
    });

    const parsedPaidAt = new Date(paidAt);

    if (transaction.membershipPayment) {
      await tx.membershipPayment.update({
        where: { id: transaction.membershipPayment.id },
        data: { paidAt: parsedPaidAt },
      });
    }

    if (transaction.matchPayment) {
      await tx.matchPayment.update({
        where: { id: transaction.matchPayment.id },
        data: { paidAt: parsedPaidAt, status: "PAID" },
      });
    }
  });

  trackOperationalEvent("pix_payment_approved", {
    transactionId: transaction.id,
    externalId,
    amount,
    paidAt,
  });

  return { success: true, transactionId: transaction.id };
}
