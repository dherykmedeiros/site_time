"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

interface Preference {
  category: string;
  enabled: boolean;
}

const CATEGORY_INFOS = [
  {
    category: "MATCHES",
    title: "⚽ Partidas e Convocações",
    description: "Novos jogos cadastrados, alterações de escalação, convocações e lembretes de RSVP.",
  },
  {
    category: "FINANCES",
    title: "💰 Mensalidades e Pagamentos",
    description: "Cobranças de mensalidades atrasadas, caixinha do time e taxas de partidas individuais.",
  },
  {
    category: "DISCIPLINARY",
    title: "⚖️ Disciplinar",
    description: "Lançamento de multas, advertências ou suspensões ativas para partidas.",
  },
  {
    category: "COMMUNICATION",
    title: "📌 Avisos e Enquetes",
    description: "Mensagens fixadas do mural, enquetes de data e comunicados gerais da diretoria.",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    MATCHES: true,
    FINANCES: true,
    DISCIPLINARY: true,
    COMMUNICATION: true,
  });
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [savingPref, setSavingPref] = useState<string | null>(null);
  const { toast } = useToast();

  async function fetchNotifications() {
    try {
      setLoadingNotifications(true);
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
    } finally {
      setLoadingNotifications(false);
    }
  }

  async function fetchPreferences() {
    try {
      setLoadingPreferences(true);
      const res = await fetch("/api/notifications/preferences");
      if (res.ok) {
        const data = await res.json();
        const prefsMap = { ...preferences };
        (data.preferences || []).forEach((p: Preference) => {
          prefsMap[p.category] = p.enabled;
        });
        setPreferences(prefsMap);
      }
    } catch (err) {
      console.error("Erro ao buscar preferências:", err);
    } finally {
      setLoadingPreferences(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  async function handleTogglePreference(category: string, currentVal: boolean) {
    try {
      setSavingPref(category);
      const newVal = !currentVal;
      const res = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, enabled: newVal }),
      });
      if (res.ok) {
        setPreferences((prev) => ({ ...prev, [category]: newVal }));
        toast("Preferência atualizada com sucesso.", "success");
      } else {
        toast("Falha ao salvar preferência.", "error");
      }
    } catch (err) {
      console.error("Erro ao salvar preferência:", err);
      toast("Erro de rede ao salvar.", "error");
    } finally {
      setSavingPref(null);
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error("Erro ao marcar como lida:", err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast("Todas as notificações foram marcadas como lidas.", "success");
      }
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "MATCH_CREATED":
        return "⚽";
      case "FINE_APPLIED":
        return "⚖️";
      case "PAYMENT_DUE":
      case "PAYMENT":
        return "💰";
      case "MESSAGE_PINNED":
      case "NOTICE":
        return "📌";
      case "RSVP_REMINDER":
        return "📅";
      case "RECAP_READY":
        return "🏆";
      default:
        return "🔔";
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Agora mesmo";
    if (diffMin < 60) return `Há ${diffMin} min`;
    if (diffHr < 24) return `Há ${diffHr} h`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mural de Notificações"
        description="Gerencie alertas recebidos e configure suas preferências de comunicação"
      />

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-2">
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Tab Histórico */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={filter === "ALL" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter("ALL")}
                  className="text-xs uppercase font-bold tracking-wider"
                >
                  Todas ({notifications.length})
                </Button>
                <Button
                  variant={filter === "UNREAD" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter("UNREAD")}
                  className="text-xs uppercase font-bold tracking-wider"
                >
                  Não lidas ({unreadCount})
                </Button>
              </div>

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs uppercase font-bold text-[var(--brand)]"
                >
                  ✓ Marcar todas como lidas
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loadingNotifications ? (
                <div className="py-12 text-center text-[#8fa39b] text-sm">
                  Carregando suas notificações...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="py-16 text-center text-[#8fa39b] space-y-3">
                  <span className="text-4xl inline-block opacity-45">📭</span>
                  <p className="font-semibold text-white text-sm">Nenhum aviso encontrado</p>
                  <p className="text-xs">Você está com todas as leituras em dia!</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && handleMarkAsRead(n.id)}
                      className={`flex gap-4 py-4 first:pt-0 last:pb-0 relative group transition hover:bg-white/[0.01] px-3 rounded-xl ${
                        !n.read ? "bg-[var(--brand-soft)]/5" : ""
                      }`}
                    >
                      {/* Unread dot */}
                      {!n.read && (
                        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[var(--brand)] rounded-full shadow-[0_0_8px_var(--brand)]" />
                      )}

                      {/* Icon */}
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] group-hover:scale-105 transition-all text-lg shadow-sm">
                        {getIconForType(n.type)}
                      </span>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className={`text-sm font-bold leading-snug ${!n.read ? "text-white" : "text-[#8fa39b]"}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-[#8fa39b] font-medium">
                            {getRelativeTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-[#8fa39b] mt-1 leading-relaxed">
                          {n.body}
                        </p>

                        {n.link && (
                          <a
                            href={n.link}
                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[var(--brand)] mt-2 hover:underline"
                          >
                            Ir para o conteúdo ➔
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Configurações */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Recebimento</CardTitle>
              <p className="text-xs text-[#8fa39b] mt-1">
                Silencie categorias específicas de notificações que você não deseja receber no seu mural
              </p>
            </CardHeader>
            <CardContent>
              {loadingPreferences ? (
                <div className="py-12 text-center text-[#8fa39b] text-sm">
                  Carregando preferências...
                </div>
              ) : (
                <div className="space-y-6">
                  {CATEGORY_INFOS.map((info) => {
                    const enabled = preferences[info.category] ?? true;
                    const saving = savingPref === info.category;

                    return (
                      <div
                        key={info.category}
                        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="space-y-1 max-w-xl">
                          <h4 className="text-sm font-bold text-white">
                            {info.title}
                          </h4>
                          <p className="text-xs text-[#8fa39b] leading-relaxed">
                            {info.description}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enabled}
                              disabled={saving}
                              onChange={() => handleTogglePreference(info.category, enabled)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand)]"></div>
                            <span className="ml-3 text-xs font-black uppercase tracking-wider text-[#8fa39b] min-w-[50px]">
                              {saving ? "..." : enabled ? "Ativo" : "Silenciado"}
                            </span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
