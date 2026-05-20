"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

interface UserReaction {
  id: string;
  userId: string;
  emoji: string;
  user: {
    id: string;
    name: string;
  };
}

interface Message {
  id: string;
  teamId: string;
  authorId: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    role: "ADMIN" | "PLAYER" | "COACH" | "MATERIAL_DIRECTOR";
  };
  reactions: UserReaction[];
}

const QUICK_EMOJIS = ["👍", "❤️", "🔥", "👏", "✅", "❌"];

const roleLabels: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  ADMIN: { label: "Admin", variant: "danger" },
  COACH: { label: "Comissão", variant: "warning" },
  MATERIAL_DIRECTOR: { label: "Dir. Material", variant: "info" },
  PLAYER: { label: "Atleta", variant: "default" },
};

export default function TeamMessagesPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const role = session?.user?.role;
  const isCoachOrAdmin = role === "ADMIN" || role === "COACH";
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [posting, setPosting] = useState(false);

  // Delete message confirmation
  const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  async function loadMessages() {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        toast("Erro ao carregar avisos do time");
      }
    } catch (err) {
      console.error(err);
      toast("Erro de conexão ao carregar avisos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handlePostMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setPosting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, pinned }),
      });

      if (res.ok) {
        toast("Aviso publicado com sucesso!");
        setContent("");
        setPinned(false);
        await loadMessages();
      } else {
        const err = await res.json().catch(() => ({}));
        toast(err.error || "Erro ao publicar aviso");
      }
    } catch {
      toast("Erro de conexão com o servidor");
    } finally {
      setPosting(false);
    }
  }

  async function handleDeleteMessage() {
    if (!deletingMessage) return;

    setDeletingLoading(true);
    try {
      const res = await fetch(`/api/messages/${deletingMessage.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast("Aviso excluído com sucesso!");
        setDeletingMessage(null);
        await loadMessages();
      } else {
        toast("Erro ao excluir o aviso");
      }
    } catch {
      toast("Erro de conexão");
    } finally {
      setDeletingLoading(false);
    }
  }

  async function handleToggleReaction(messageId: string, emoji: string) {
    try {
      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;

          const alreadyReacted = msg.reactions.find(
            (r) => r.userId === currentUserId && r.emoji === emoji
          );

          let newReactions = [...msg.reactions];
          if (alreadyReacted) {
            newReactions = newReactions.filter((r) => r.id !== alreadyReacted.id);
          } else {
            // Push a temporary reaction
            newReactions.push({
              id: "temp-" + Math.random(),
              userId: currentUserId || "",
              emoji,
              user: {
                id: currentUserId || "",
                name: session?.user?.name || "Você",
              },
            });
          }

          return { ...msg, reactions: newReactions };
        })
      );

      const res = await fetch(`/api/messages/${messageId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });

      if (!res.ok) {
        // Fallback in case of error
        await loadMessages();
      } else {
        // Reload silently to get fresh database IDs for the reactions
        const data = await res.json();
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== messageId) return msg;
            
            // Filter out any temporary reactions
            let finalReactions = msg.reactions.filter((r) => !r.id.startsWith("temp-"));
            
            if (data.reacted) {
              finalReactions.push(data.reaction);
            } else {
              finalReactions = finalReactions.filter(
                (r) => !(r.userId === currentUserId && r.emoji === emoji)
              );
            }
            return { ...msg, reactions: finalReactions };
          })
        );
      }
    } catch {
      await loadMessages();
    }
  }

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
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 rounded-[22px] border border-[rgba(16,185,129,0.18)] bg-[rgba(10,24,20,0.4)] p-6 sm:flex-row sm:items-center sm:justify-between backdrop-blur-md">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#34d399]">
            Quadro de Avisos
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Mural do Time</h1>
        </div>
        <div className="text-[11px] font-semibold text-[#8fa39b] bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
          </span>
          Atualizado em tempo real
        </div>
      </div>

      {/* Admin/Coach Post Form */}
      {isCoachOrAdmin && (
        <Card className="rounded-[22px] border border-[rgba(16,185,129,0.14)] bg-[rgba(10,24,20,0.2)] overflow-hidden backdrop-blur-md shadow-lg transition-all hover:border-[rgba(16,185,129,0.25)]">
          <CardContent className="p-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#34d399] mb-4 flex items-center gap-2">
              <span>📢</span> Publicar Novo Aviso
            </h2>
            <form onSubmit={handlePostMessage} className="space-y-4">
              <Textarea
                placeholder="Escreva a mensagem ou aviso importante para o elenco..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={3}
                className="bg-black/40 border-white/5 focus:border-[#10b981] placeholder-[#8fa39b]/50 text-white rounded-xl"
              />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer group text-xs font-bold text-[#8fa39b] hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-black/40 text-[#10b981] focus:ring-0 cursor-pointer accent-[#10b981]"
                  />
                  <span className="flex items-center gap-1">
                    📌 Fixar aviso no topo
                  </span>
                </label>

                <Button
                  type="submit"
                  loading={posting}
                  disabled={posting || !content.trim()}
                  className="rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399] transition-all duration-300"
                >
                  Publicar Aviso
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Messages List Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl bg-white/[0.02] border border-white/5"
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <Card className="rounded-[22px] border border-dashed border-white/5 p-12 text-center text-[var(--text-muted)] bg-transparent">
            <span className="text-4xl mb-3 block">📯</span>
            <p className="text-base font-bold text-white">Nenhum aviso publicado</p>
            <p className="mt-1 text-xs text-[#8fa39b]">
              Os recados e anúncios importantes do time aparecerão aqui.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isPinned = message.pinned;
              const initials = getInitials(message.author.name);
              const authorRole = message.author.role;
              const hasDeletePermission =
                currentUserId === message.authorId || role === "ADMIN";

              // Check color theme based on role
              let avatarBg = "bg-white/[0.04] text-white border-white/5";
              if (authorRole === "ADMIN") {
                avatarBg = "bg-[rgba(239,68,68,0.1)] text-[#ef4444] border-[#ef4444]/20";
              } else if (authorRole === "COACH") {
                avatarBg = "bg-[rgba(245,158,11,0.1)] text-[#f59e0b] border-[#f59e0b]/20";
              }

              return (
                <div
                  key={message.id}
                  className={`group relative rounded-[22px] border backdrop-blur-md transition-all duration-300 shadow-md ${
                    isPinned
                      ? "border-[#10b981]/30 bg-[rgba(16,185,129,0.03)] shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:border-[#10b981]/50"
                      : "border-white/5 bg-[rgba(10,20,18,0.3)] hover:border-white/10"
                  }`}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Message Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar initials fallback */}
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-black tracking-wider ${avatarBg}`}
                        >
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-white truncate max-w-[160px] sm:max-w-xs">
                              {message.author.name}
                            </span>
                            {roleLabels[authorRole] && (
                              <Badge variant={roleLabels[authorRole].variant}>
                                {roleLabels[authorRole].label}
                              </Badge>
                            )}
                            {isPinned && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#10b981]/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#34d399] border border-[#10b981]/20">
                                📌 Fixado
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#8fa39b]/60 font-semibold mt-0.5 block">
                            {getRelativeTime(message.createdAt)}
                          </span>
                        </div>
                      </div>

                      {hasDeletePermission && (
                        <button
                          onClick={() => setDeletingMessage(message)}
                          className="text-[#8fa39b] hover:text-[#ef4444] p-1.5 rounded-lg hover:bg-white/[0.03] transition-all cursor-pointer"
                          title="Excluir aviso"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="text-sm text-[rgba(240,247,244,0.9)] leading-relaxed whitespace-pre-wrap font-medium">
                      {message.content}
                    </div>

                    {/* Reactions Section */}
                    <div className="pt-3.5 border-t border-white/5 flex flex-wrap items-center gap-2">
                      {QUICK_EMOJIS.map((emoji) => {
                        const matchingReactions = message.reactions.filter(
                          (r) => r.emoji === emoji
                        );
                        const count = matchingReactions.length;
                        const hasReacted = matchingReactions.some(
                          (r) => r.userId === currentUserId
                        );
                        const usernames = matchingReactions
                          .map((r) => r.user.name)
                          .join(", ");

                        return (
                          <div key={emoji} className="relative group/emoji">
                            <button
                              onClick={() => handleToggleReaction(message.id, emoji)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                hasReacted
                                  ? "bg-[rgba(16,185,129,0.1)] text-[#34d399] border border-[#10b981]/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                                  : count > 0
                                  ? "bg-white/[0.04] text-white border border-white/5 hover:bg-white/[0.08]"
                                  : "bg-transparent text-[#8fa39b]/60 hover:text-white hover:bg-white/[0.03]"
                              }`}
                            >
                              <span>{emoji}</span>
                              {count > 0 && (
                                <span className="font-extrabold text-[11px]">
                                  {count}
                                </span>
                              )}
                            </button>

                            {/* Reacted users list tooltip */}
                            {count > 0 && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/emoji:block bg-black/90 border border-white/10 rounded-xl px-2.5 py-1.5 text-[9px] text-[#8fa39b] whitespace-nowrap shadow-2xl z-50 pointer-events-none">
                                Reagido por:{" "}
                                <span className="text-white font-extrabold">
                                  {usernames}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingMessage}
        onClose={() => setDeletingMessage(null)}
        title="Excluir Aviso"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#8fa39b] leading-relaxed">
            Tem certeza de que deseja excluir permanentemente este aviso? Todos os membros do time deixarão de vê-lo.
          </p>
          {deletingMessage && (
            <div className="rounded-xl border border-white/5 bg-black/20 p-3 text-xs text-[#8fa39b] italic max-h-24 overflow-y-auto">
              "{deletingMessage.content}"
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              variant="danger"
              onClick={handleDeleteMessage}
              loading={deletingLoading}
              disabled={deletingLoading}
              className="rounded-xl px-4 py-2 text-xs font-black uppercase"
            >
              Excluir
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeletingMessage(null)}
              disabled={deletingLoading}
              className="rounded-xl px-4 py-2 text-xs font-bold"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
