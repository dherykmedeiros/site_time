"use client";

import React, { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Upload, CheckCircle, Clock } from "lucide-react";

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface PlayerFinanceTabProps {
  membershipPayments: Array<{
    id: string;
    month: number;
    year: number;
    amount: any;
    paidAt: string | Date;
  }>;
  matchPayments: Array<{
    id: string;
    amount: any;
    paidAt: string | Date;
    matchId?: string;
    receiptUrl?: string | null;
    status?: string;
    match: {
      date: string | Date;
      opponent: string;
    };
  }>;
}

export function PlayerFinanceTab({ membershipPayments, matchPayments }: PlayerFinanceTabProps) {
  const { toast } = useToast();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedMatchId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Falha no upload do arquivo.");
      }

      const { url } = await uploadRes.json();

      const receiptRes = await fetch(`/api/matches/${selectedMatchId}/charges/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptUrl: url }),
      });

      if (!receiptRes.ok) {
        const err = await receiptRes.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao registrar comprovante.");
      }

      toast("Comprovante enviado com sucesso para análise do financeiro!", "success");
      setUploadModalOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erro no envio do comprovante.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Mensalidades */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-[#8fa39b]">
            💳 Histórico de Mensalidades (Caixinha)
          </h2>
          <p className="text-[11px] text-[#8fa39b] mt-0.5">
            Pagamentos de mensalidades regulares do clube registrados
          </p>
        </div>

        {membershipPayments.length === 0 ? (
          <div className="py-12 text-center text-[#8fa39b]">
            <p className="text-3xl mb-2">💸</p>
            <p className="font-semibold text-white text-sm">Nenhuma mensalidade registrada</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {membershipPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3"
              >
                <div>
                  <p className="font-bold text-sm text-white">
                    {monthNames[payment.month - 1]} / {payment.year}
                  </p>
                  <p className="text-[10px] text-[#8fa39b] mt-0.5">
                    Pago em: {formatDate(new Date(payment.paidAt))}
                  </p>
                </div>
                <span className="rounded-full bg-[#10b981]/10 border border-[#10b981]/25 px-3 py-1 text-xs font-black text-[#34d399]">
                  {formatCurrency(Number(payment.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Taxas de Partidas */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
        <div>
          <h2 className="text-xs font-black uppercase tracking-widest text-[#8fa39b]">
            ⚽ Taxas de Partidas & Comprovantes
          </h2>
          <p className="text-[11px] text-[#8fa39b] mt-0.5">
            Contribuições por jogo disputado e envio de comprovantes PIX
          </p>
        </div>

        {matchPayments.length === 0 ? (
          <div className="py-12 text-center text-[#8fa39b]">
            <p className="text-3xl mb-2">⚽</p>
            <p className="font-semibold text-white text-sm">Nenhum histórico de taxa de jogo</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {matchPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 gap-3"
              >
                <div>
                  <p className="font-bold text-sm text-white">
                    vs {payment.match.opponent}
                  </p>
                  <p className="text-[10px] text-[#8fa39b] mt-0.5">
                    {payment.paidAt ? `Pago em: ${formatDate(new Date(payment.paidAt))}` : `Data: ${formatDate(new Date(payment.match.date))}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {payment.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                      <Clock className="w-3 h-3" /> Em Análise
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-500/10 border border-blue-500/25 px-3 py-1 text-xs font-black text-blue-400">
                      {formatCurrency(Number(payment.amount))}
                    </span>
                  )}
                  {payment.matchId && payment.status !== "PAID" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs gap-1"
                      onClick={() => {
                        setSelectedMatchId(payment.matchId!);
                        setUploadModalOpen(true);
                      }}
                    >
                      <Upload className="w-3.5 h-3.5" /> Enviar Comprovante
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Enviar Comprovante */}
      <Modal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Enviar Comprovante PIX"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#8fa39b]">
            Selecione a foto ou PDF do seu comprovante de pagamento para que a diretoria financeira valide sua taxa de jogo.
          </p>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-emerald-500/40 transition">
            <Upload className="w-8 h-8 text-[#34d399] mx-auto mb-2 opacity-80" />
            <label className="cursor-pointer block text-xs font-bold text-white mb-1">
              {uploading ? "Enviando arquivo..." : "Clique aqui para selecionar o arquivo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                disabled={uploading}
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-[10px] text-[#8fa39b]">Formatos aceitos: JPG, PNG, WebP (Máx: 5MB)</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
