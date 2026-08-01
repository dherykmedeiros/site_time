"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load notifications
  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
    }
  }

  useEffect(() => {
    fetchNotifications();
    // Poll every 45 seconds for new notifications
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAllAsRead() {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Erro ao marcar todas como lidas:", err);
    }
  }

  async function markAsRead(id: string) {
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

  const handleNotificationClick = async (n: Notification) => {
    if (!n.read) {
      await markAsRead(n.id);
    }
    setIsOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "MATCH_CREATED": return "⚽";
      case "FINE_APPLIED": return "⚖️";
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

  function getRelativeTime(dateString: string) {
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
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-xl text-[var(--text-muted)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--brand)]/50"
        title="Central de Notificações"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[9px] font-black text-[var(--bg)] animate-pulse shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Glassmorphic Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 max-h-[500px] flex flex-col z-[999] bg-[var(--bg-card)] border border-[var(--border-active)] shadow-2xl rounded-2xl overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border)] bg-[var(--brand-soft)]/20">
            <span className="text-xs font-black uppercase tracking-[0.15em] text-[var(--brand)] flex items-center gap-1.5 font-serif">
              <span>🔔</span> Notificações
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--brand)] transition-all cursor-pointer bg-transparent border-none"
              >
                Limpar todas
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)] max-h-[380px] scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <span className="text-3xl mb-2 opacity-40">📭</span>
                <p className="text-xs font-semibold text-[var(--text-muted)]">Tudo limpo por aqui!</p>
                <p className="text-[10px] text-[var(--text-subtle)] mt-1">Você não possui notificações no momento.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex gap-3.5 p-4 text-left transition-all duration-200 cursor-pointer hover:bg-[var(--bg-elevated)] relative group ${
                    !n.read ? "bg-[var(--brand-soft)]/5" : ""
                  }`}
                >
                  {/* Unread indicator */}
                  {!n.read && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[var(--brand)] rounded-full shadow-[0_0_8px_var(--brand)]" />
                  )}

                  {/* Icon */}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] group-hover:scale-105 transition-all text-base">
                    {getIconForType(n.type)}
                  </span>

                  {/* Body details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className={`text-xs font-bold leading-tight truncate ${!n.read ? "text-[var(--text)] font-serif" : "text-[var(--text-muted)]"}`}>
                        {n.title}
                      </p>
                      <span className="text-[9px] text-[var(--text-subtle)] shrink-0 font-medium whitespace-nowrap">
                        {getRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1 font-medium leading-relaxed break-words">
                      {n.body}
                    </p>

                    {n.link && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[var(--brand)] mt-1.5 group-hover:underline">
                        Visualizar detalhe ➔
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[var(--border)] bg-[var(--bg-elevated)] p-2.5 text-center">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-block text-xs font-bold text-[var(--brand)] hover:underline"
            >
              Ver todas as notificações ➔
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
