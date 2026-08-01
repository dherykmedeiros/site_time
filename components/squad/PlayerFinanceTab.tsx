"use client";

import React from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
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
    match: {
      date: string | Date;
      opponent: string;
    };
  }>;
}

export function PlayerFinanceTab({ membershipPayments, matchPayments }: PlayerFinanceTabProps) {
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
            <p className="font-semibold text-white text-sm">Nenhuma mensalidade paga</p>
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
            ⚽ Taxas de Partidas
          </h2>
          <p className="text-[11px] text-[#8fa39b] mt-0.5">
            Contribuições individuais por jogo disputado
          </p>
        </div>

        {matchPayments.length === 0 ? (
          <div className="py-12 text-center text-[#8fa39b]">
            <p className="text-3xl mb-2">⚽</p>
            <p className="font-semibold text-white text-sm">Nenhum pagamento de jogo</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {matchPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3"
              >
                <div>
                  <p className="font-bold text-sm text-white">
                    vs {payment.match.opponent}
                  </p>
                  <p className="text-[10px] text-[#8fa39b] mt-0.5">
                    Pago em: {formatDate(new Date(payment.paidAt))}
                  </p>
                </div>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/25 px-3 py-1 text-xs font-black text-blue-400">
                  {formatCurrency(Number(payment.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
