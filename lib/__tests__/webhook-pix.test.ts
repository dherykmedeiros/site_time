import { vi, describe, it, expect, beforeEach } from "vitest";
import { validateWebhookSignature, processPixPayment } from "../webhook-pix";
import { prisma } from "@/lib/prisma";
import type { Transaction } from "@prisma/client";

vi.mock("@/lib/prisma", () => {
  const mockPrisma = {
    transaction: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    membershipPayment: {
      update: vi.fn(),
    },
    matchPayment: {
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

vi.mock("@/lib/telemetry", () => ({
  trackOperationalEvent: vi.fn(),
}));

describe("PIX Webhook processing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.WEBHOOK_PIX_SECRET = "test-secret-key";
  });

  describe("validateWebhookSignature", () => {
    it("should return true when secret matches", () => {
      expect(validateWebhookSignature("test-secret-key")).toBe(true);
    });

    it("should return false when secret does not match", () => {
      expect(validateWebhookSignature("wrong-secret")).toBe(false);
    });

    it("should return false when header is null", () => {
      expect(validateWebhookSignature(null)).toBe(false);
    });

    it("should return false when env variable is not set", () => {
      delete process.env.WEBHOOK_PIX_SECRET;
      expect(validateWebhookSignature("test-secret-key")).toBe(false);
    });
  });

  describe("processPixPayment", () => {
    it("should process and approve a pending transaction with correct amount", async () => {
      const mockTx = {
        id: "tx-1",
        amount: 50.0,
        status: "PENDING",
        membershipPayment: null,
        matchPayment: null,
      };

      vi.mocked(prisma.transaction.findUnique).mockResolvedValue(mockTx as unknown as Transaction);

      const result = await processPixPayment({
        externalId: "ext-1",
        amount: 50.0,
        paidAt: "2026-07-17T12:00:00Z",
      });

      expect(result).toEqual({ success: true, transactionId: "tx-1" });
      expect(prisma.transaction.update).toHaveBeenCalledWith({
        where: { id: "tx-1" },
        data: { status: "PAID" },
      });
    });

    it("should update linked membershipPayment if present", async () => {
      const mockTx = {
        id: "tx-1",
        amount: 120.0,
        status: "PENDING",
        membershipPayment: { id: "mem-pay-1" },
        matchPayment: null,
      };

      vi.mocked(prisma.transaction.findUnique).mockResolvedValue(mockTx as unknown as Transaction);

      const result = await processPixPayment({
        externalId: "ext-2",
        amount: 120.0,
        paidAt: "2026-07-17T12:00:00Z",
      });

      expect(result).toEqual({ success: true, transactionId: "tx-1" });
      expect(prisma.membershipPayment.update).toHaveBeenCalledWith({
        where: { id: "mem-pay-1" },
        data: { paidAt: new Date("2026-07-17T12:00:00Z") },
      });
    });

    it("should update linked matchPayment status and paidAt if present", async () => {
      const mockTx = {
        id: "tx-1",
        amount: 30.0,
        status: "PENDING",
        membershipPayment: null,
        matchPayment: { id: "match-pay-1" },
      };

      vi.mocked(prisma.transaction.findUnique).mockResolvedValue(mockTx as unknown as Transaction);

      const result = await processPixPayment({
        externalId: "ext-3",
        amount: 30.0,
        paidAt: "2026-07-17T12:00:00Z",
      });

      expect(result).toEqual({ success: true, transactionId: "tx-1" });
      expect(prisma.matchPayment.update).toHaveBeenCalledWith({
        where: { id: "match-pay-1" },
        data: { paidAt: new Date("2026-07-17T12:00:00Z"), status: "PAID" },
      });
    });

    it("should return TRANSACTION_NOT_FOUND if externalId does not exist", async () => {
      vi.mocked(prisma.transaction.findUnique).mockResolvedValue(null);

      const result = await processPixPayment({
        externalId: "invalid-ext-id",
        amount: 50.0,
        paidAt: "2026-07-17T12:00:00Z",
      });

      expect(result).toEqual({
        success: false,
        error: "Transação não encontrada",
        code: "TRANSACTION_NOT_FOUND",
      });
    });

    it("should return AMOUNT_MISMATCH if payment amount differs from transaction amount", async () => {
      const mockTx = {
        id: "tx-1",
        amount: 50.0,
        status: "PENDING",
        membershipPayment: null,
        matchPayment: null,
      };

      vi.mocked(prisma.transaction.findUnique).mockResolvedValue(mockTx as unknown as Transaction);

      const result = await processPixPayment({
        externalId: "ext-1",
        amount: 45.0, // divergent
        paidAt: "2026-07-17T12:00:00Z",
      });

      expect(result).toEqual({
        success: false,
        error: "Valor pago divergente do valor registrado",
        code: "AMOUNT_MISMATCH",
      });
    });

    it("should return success and be idempotent if transaction is already PAID", async () => {
      const mockTx = {
        id: "tx-1",
        amount: 50.0,
        status: "PAID", // already PAID
        membershipPayment: null,
        matchPayment: null,
      };

      vi.mocked(prisma.transaction.findUnique).mockResolvedValue(mockTx as unknown as Transaction);

      const result = await processPixPayment({
        externalId: "ext-1",
        amount: 50.0,
        paidAt: "2026-07-17T12:00:00Z",
      });

      expect(result).toEqual({ success: true, transactionId: "tx-1" });
      expect(prisma.transaction.update).not.toHaveBeenCalled();
    });
  });
});
