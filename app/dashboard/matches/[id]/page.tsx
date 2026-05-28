"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { BordereauCard } from "@/components/dashboard/BordereauCard";
import { MatchEquipmentCard } from "@/components/dashboard/MatchEquipmentCard";
import { LiveMatchControl } from "@/components/dashboard/LiveMatchControl";
import { GuestPlayersManager } from "@/components/dashboard/GuestPlayersManager";
import { SuggestedLineupCard } from "@/components/dashboard/SuggestedLineupCard";
import { TeamRecapWidget } from "@/components/dashboard/TeamRecapWidget";
import { MatchPhotosGallery } from "@/components/dashboard/MatchPhotosGallery";
import type { BordereauResponse, SuggestedLineupResponse } from "@/lib/validations/match";
import { Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const PostGameForm = dynamic(
  () => import("@/components/forms/PostGameForm").then((m) => ({ default: m.PostGameForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

const MatchForm = dynamic(
  () => import("@/components/forms/MatchForm").then((m) => ({ default: m.MatchForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

const TransactionForm = dynamic(
  () => import("@/components/forms/TransactionForm").then((m) => ({ default: m.TransactionForm })),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

function TeammateRatingRow({
  player,
  currentUserPlayerId,
  userRating,
  averageRating,
  totalRatings,
  canRate,
  onRate,
  isSubmitting,
}: {
  player: PlayerStat;
  currentUserPlayerId: string | null;
  userRating: number | null;
  averageRating: number;
  totalRatings: number;
  canRate: boolean;
  onRate: (stars: number) => void;
  isSubmitting: boolean;
}) {
  const isSelf = currentUserPlayerId && currentUserPlayerId === player.playerId;
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);

  const disabled = isSelf || !canRate || isSubmitting;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] transition-all duration-300 ${
        isSelf ? "opacity-60 bg-black/10" : "hover:bg-white/[0.03] hover:border-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 text-white font-bold text-sm">
          {player.playerName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">{player.playerName}</span>
            {isSelf && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase text-white/70">
                Você
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8fa39b]">
            <span>Média: <strong className="text-white">{averageRating.toFixed(1)}⭐</strong></span>
            <span>·</span>
            <span>{totalRatings} {totalRatings === 1 ? "avaliação" : "avaliações"}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-0 flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = hoveredStars !== null ? star <= hoveredStars : star <= (userRating || 0);
            return (
              <button
                key={star}
                type="button"
                disabled={disabled}
                onClick={() => onRate(star)}
                onMouseEnter={() => !disabled && setHoveredStars(star)}
                onMouseLeave={() => !disabled && setHoveredStars(null)}
                className={`transition-all duration-150 focus:outline-none ${
                  disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-125"
                }`}
              >
                <Star
                  className={`h-5 w-5 ${
                    isFilled
                      ? "fill-yellow-400 text-yellow-400 animate-none"
                      : "text-white/20 fill-transparent"
                  } ${isSubmitting ? "animate-pulse" : ""}`}
                />
              </button>
            );
          })}
        </div>

        {userRating && (
          <span className="text-[10px] font-black uppercase text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md border border-yellow-400/20">
            Sua Nota: {userRating}
          </span>
        )}
      </div>
    </div>
  );
}

interface RSVP {
  playerId: string;
  playerName: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  respondedAt: string | null;
}

interface PlayerStat {
  playerId: string;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface MatchDetail {
  id: string;
  date: string;
  venue: string;
  opponent: string;
  isHome: boolean;
  opponentBadgeUrl: string | null;
  type: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  shareToken: string;
  shareUrl: string;
  rsvps: RSVP[];
  stats: PlayerStat[];
  canSubmitPostGame: boolean;
  hasCharge: boolean;
  chargeAmount: number | null;
  season?: { id: string; name: string; type: string; status: string } | null;
  positionLimits?: Array<{ position: string; maxPlayers: number }>;
  createdAt: string;
  updatedAt: string;
}

interface MatchLineupResponse {
  matchId: string;
  generatedAt: string;
  imageUrl: string;
  lineup: SuggestedLineupResponse;
}

type ScheduledWorkspaceSection = "overview" | "presence" | "lineup" | "operations" | "postgame" | "gallery" | "live" | "guests" | "charges";

const statusLabels: Record<string, string> = {
  SCHEDULED: "Agendada",
  COMPLETED: "Finalizada",
  CANCELLED: "Cancelada",
};

const statusVariants: Record<string, "info" | "success" | "danger"> = {
  SCHEDULED: "info",
  COMPLETED: "success",
  CANCELLED: "danger",
};

const rsvpStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  DECLINED: "Recusado",
};

const rsvpStatusVariants: Record<string, "warning" | "success" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  DECLINED: "danger",
};

function formatMatchDate(isoDate: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(isoDate));
}

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isCoachOrAdmin = isAdmin || session?.user?.role === "COACH";
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<{ message: string; name?: string; stack?: string; status?: number } | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [showPostGame, setShowPostGame] = useState(false);
  const [showEditMatch, setShowEditMatch] = useState(false);
  const [showEditPostGame, setShowEditPostGame] = useState(false);
  const [showConvocacao, setShowConvocacao] = useState(false);
  const [convocacaoText, setConvocacaoText] = useState("");
  const [showLineupShare, setShowLineupShare] = useState(false);
  const [lineupShareText, setLineupShareText] = useState("");
  const [copyMsg, setCopyMsg] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [lineupData, setLineupData] = useState<MatchLineupResponse | null>(null);
  const [lineupLoading, setLineupLoading] = useState(false);
  const [lineupRefreshing, setLineupRefreshing] = useState(false);
  const [lineupSaving, setLineupSaving] = useState(false);
  const [lineupError, setLineupError] = useState<string | null>(null);
  const [bordereauData, setBordereauData] = useState<BordereauResponse | null>(null);
  const [bordereauLoading, setBordereauLoading] = useState(false);
  const [bordereauSaving, setBordereauSaving] = useState(false);
  const [bordereauError, setBordereauError] = useState<string | null>(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ScheduledWorkspaceSection>("overview");

  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [userRatings, setUserRatings] = useState<Array<{ playerId: string; stars: number }>>([]);
  const [ratingsAverages, setRatingsAverages] = useState<Array<{ playerId: string; averageStars: number; totalRatings: number }>>([]);
  const [canRate, setCanRate] = useState(false);
  const [submittingRatingId, setSubmittingRatingId] = useState<string | null>(null);

  // Match Charges state inside the match detail page
  const [checklistPlayers, setChecklistPlayers] = useState<any[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [togglingPlayerId, setTogglingPlayerId] = useState<string | null>(null);
  const [chargesFeedback, setChargesFeedback] = useState<string | null>(null);
  const [chargesError, setChargesError] = useState<string | null>(null);

  const loadChecklistPlayers = useCallback(async () => {
    if (!id) return;
    setChecklistLoading(true);
    setChargesError(null);
    try {
      const res = await fetch(`/api/matches/${id}/charges`);
      if (res.ok) {
        const data = await res.json();
        setChecklistPlayers(data.players || []);
      } else {
        setChargesError("Erro ao carregar pagamentos");
      }
    } catch (err) {
      setChargesError("Erro de conexão ao carregar pagamentos");
    } finally {
      setChecklistLoading(false);
    }
  }, [id]);

  const handleTogglePayment = async (playerId: string, isPaid: boolean) => {
    if (!id || !match) return;
    setTogglingPlayerId(playerId);
    setChargesError(null);
    setChargesFeedback(null);
    try {
      const method = isPaid ? "POST" : "DELETE";
      const res = await fetch(`/api/matches/${id}/charges/${playerId}`, {
        method,
      });
      if (res.ok) {
        setChecklistPlayers((prev) =>
          prev.map((p) => {
            if (p.id === playerId) {
              return {
                ...p,
                payment: isPaid ? { amount: match.chargeAmount } : null,
              };
            }
            return p;
          })
        );
        setChargesFeedback(isPaid ? "Pagamento registrado com sucesso!" : "Pagamento estornado com sucesso!");
        setTimeout(() => setChargesFeedback(null), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setChargesError(data.error || "Erro ao atualizar pagamento");
      }
    } catch (err) {
      setChargesError("Erro de conexão");
    } finally {
      setTogglingPlayerId(null);
    }
  };

  useEffect(() => {
    if (activeSection === "charges") {
      loadChecklistPlayers();
    }
  }, [activeSection, loadChecklistPlayers]);

  const fetchMatch = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setDetailedError(null);
    try {
      const res = await fetch(`/api/matches/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMatch(data);
      } else if (res.status === 404) {
        setMatch(null);
        setLoadError("Partida nao encontrada.");
        try {
          const errData = await res.json();
          setDetailedError({
            message: errData.error || "Partida não encontrada no banco de dados.",
            status: res.status,
          });
        } catch {
          setDetailedError({
            message: "Partida não encontrada (404).",
            status: 404,
          });
        }
      } else {
        setMatch(null);
        setLoadError("Nao foi possivel carregar os dados da partida.");
        try {
          const errData = await res.json();
          setDetailedError({
            message: errData.details || errData.error || "Erro interno do servidor.",
            name: errData.name || "ServerError",
            stack: errData.stack,
            status: res.status,
          });
        } catch {
          setDetailedError({
            message: `Erro na resposta do servidor (Código HTTP: ${res.status}).`,
            status: res.status,
          });
        }
      }
    } catch (err: any) {
      setMatch(null);
      setLoadError("Erro de conexao ao carregar a partida.");
      setDetailedError({
        message: err.message || String(err),
        name: err.name || "FetchError",
        stack: err.stack,
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  const fetchLineup = useCallback(async (options?: { refresh?: boolean }) => {
    if (!isCoachOrAdmin || !match || match.status !== "SCHEDULED") {
      setLineupData(null);
      setLineupError(null);
      return;
    }

    if (options?.refresh) {
      setLineupRefreshing(true);
    } else {
      setLineupLoading(true);
    }

    try {
      const res = await fetch(`/api/matches/${id}/lineup`);
      const data = await res.json();

      if (!res.ok) {
        setLineupError(data.error || "Erro ao carregar sugestao de escalacao");
        return;
      }

      setLineupData(data);
      setLineupError(null);
    } catch {
      setLineupError("Erro de conexão ao carregar sugestao de escalacao");
    } finally {
      setLineupLoading(false);
      setLineupRefreshing(false);
    }
  }, [id, isCoachOrAdmin, match]);

  useEffect(() => {
    if (!match) {
      return;
    }

    fetchLineup();
  }, [match, fetchLineup]);

  const fetchBordereau = useCallback(async () => {
    if (!isAdmin || !match || (match.status !== "SCHEDULED" && match.status !== "COMPLETED")) {
      setBordereauData(null);
      setBordereauError(null);
      return;
    }

    setBordereauLoading(true);
    try {
      const res = await fetch(`/api/matches/${id}/bordereau`);
      const data = await res.json();

      if (!res.ok) {
        setBordereauError(data.error || "Erro ao carregar bordero");
        return;
      }

      setBordereauData(data);
      setBordereauError(null);
    } catch {
      setBordereauError("Erro de conexão ao carregar bordero");
    } finally {
      setBordereauLoading(false);
    }
  }, [id, isAdmin, match]);

  useEffect(() => {
    if (!match) {
      return;
    }

    fetchBordereau();
  }, [match, fetchBordereau]);

  const fetchRatings = useCallback(async () => {
    if (!match || match.status !== "COMPLETED") return;
    setRatingsLoading(true);
    try {
      const res = await fetch(`/api/matches/${id}/ratings`);
      if (res.ok) {
        const data = await res.json();
        setUserRatings(data.userRatings || []);
        setRatingsAverages(data.averages || []);
        setCanRate(data.canRate || false);
      }
    } catch (err) {
      console.error("Erro ao buscar avaliações:", err);
    } finally {
      setRatingsLoading(false);
    }
  }, [id, match]);

  useEffect(() => {
    if (activeSection === "postgame" && match?.status === "COMPLETED") {
      fetchRatings();
    }
  }, [activeSection, match?.status, fetchRatings]);

  async function handleRateTeammate(ratedId: string, stars: number) {
    if (!canRate) return;
    setSubmittingRatingId(ratedId);
    try {
      const res = await fetch(`/api/matches/${id}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratedId, stars }),
      });
      if (res.ok) {
        const data = await res.json();
        setUserRatings((prev) => {
          const filtered = prev.filter((r) => r.playerId !== ratedId);
          return [...filtered, { playerId: ratedId, stars }];
        });
        setRatingsAverages((prev) => {
          const filtered = prev.filter((r) => r.playerId !== ratedId);
          return [
            ...filtered,
            {
              playerId: ratedId,
              averageStars: data.averageStars,
              totalRatings: data.totalRatings,
            },
          ];
        });
        setFeedback("Avaliação salva com sucesso!");
        setTimeout(() => setFeedback(null), 2500);
      } else {
        const errData = await res.json();
        setActionError(errData.error || "Erro ao salvar avaliação");
      }
    } catch (err) {
      setActionError("Erro de conexão ao registrar avaliação");
    } finally {
      setSubmittingRatingId(null);
    }
  }

  useEffect(() => {
    const allowedSections: ScheduledWorkspaceSection[] = ["overview", "presence", "gallery"];

    if (isCoachOrAdmin && match?.status === "SCHEDULED") {
      allowedSections.push("lineup");
    }

    if (isAdmin && (match?.status === "SCHEDULED" || match?.status === "COMPLETED")) {
      allowedSections.push("operations");
    }

    if ((isAdmin && match?.canSubmitPostGame) || match?.status === "COMPLETED") {
      allowedSections.push("postgame");
    }

    if (isAdmin) {
      allowedSections.push("live");
    }

    if (isCoachOrAdmin) {
      allowedSections.push("guests");
    }

    if (match?.hasCharge) {
      allowedSections.push("charges");
    }

    if (!allowedSections.includes(activeSection)) {
      setActiveSection("overview");
    }
  }, [activeSection, isAdmin, isCoachOrAdmin, match?.canSubmitPostGame, match?.status, match?.hasCharge]);

  function toggleChecklistItem(index: number) {
    setBordereauData((current) => {
      if (!current) return current;
      return {
        ...current,
        checklist: current.checklist.map((item, itemIndex) =>
          itemIndex === index ? { ...item, isChecked: !item.isChecked } : item
        ),
      };
    });
  }

  function toggleAttendance(playerId: string) {
    setBordereauData((current) => {
      if (!current) return current;

      const nextAttendance = current.attendance.map((item) => {
        if (item.playerId !== playerId) {
          return item;
        }

        const nextPresent = !item.present;
        return {
          ...item,
          present: nextPresent,
          checkedInAt: nextPresent ? new Date().toISOString() : null,
        };
      });
      const presentCount = nextAttendance.filter((item) => item.present).length;
      const suggestedSharePerPresent = presentCount > 0
        ? Number((current.costSummary.totalExpense / presentCount).toFixed(2))
        : null;

      return {
        ...current,
        attendance: nextAttendance,
        costSummary: {
          ...current.costSummary,
          presentCount,
          suggestedSharePerPresent,
        },
      };
    });
  }

  function handleShirtNumberChange(playerId: string, shirtNumber: number | null) {
    setBordereauData((current) => {
      if (!current) return current;

      return {
        ...current,
        attendance: current.attendance.map((item) =>
          item.playerId === playerId ? { ...item, shirtNumber } : item
        ),
      };
    });
  }

  async function handleSaveBordereau() {
    if (!bordereauData) return;

    setBordereauSaving(true);
    setBordereauError(null);

    try {
      const res = await fetch(`/api/matches/${id}/bordereau`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklist: bordereauData.checklist.map((item) => ({
            label: item.label,
            isChecked: item.isChecked,
            sortOrder: item.sortOrder,
          })),
          attendance: bordereauData.attendance.map((item) => ({
            playerId: item.playerId,
            present: item.present,
            shirtNumber: item.shirtNumber,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBordereauError(data.error || "Erro ao salvar bordero");
        return;
      }

      setBordereauData(data);
      setFeedback("Bordero atualizado com sucesso.");
    } catch {
      setBordereauError("Erro de conexão ao salvar bordero");
    } finally {
      setBordereauSaving(false);
    }
  }

  async function handleSaveLineup(payload: {
    formation?: string | null;
    blockPreset?: string | null;
    starters: Array<{ playerId: string; fieldX: number | null; fieldY: number | null }>;
    bench: string[];
  }) {
    setLineupSaving(true);
    setLineupError(null);

    try {
      const res = await fetch(`/api/matches/${id}/lineup`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setLineupError(data.error || "Erro ao salvar escalacao");
        return;
      }

      setLineupData(data);
      setLineupError(null);
      setFeedback("Escalacao salva com sucesso para esta partida.");
    } catch {
      setLineupError("Erro de conexão ao salvar escalacao");
    } finally {
      setLineupSaving(false);
    }
  }

  async function handleResetSavedLineup() {
    setLineupSaving(true);
    setLineupError(null);

    try {
      const res = await fetch(`/api/matches/${id}/lineup`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setLineupError(data.error || "Erro ao resetar escalacao");
        return;
      }

      setLineupData(data);
      setLineupError(null);
      setFeedback("Escalacao manual removida. A sugestao automatica voltou a valer.");
    } catch {
      setLineupError("Erro de conexão ao resetar escalacao");
    } finally {
      setLineupSaving(false);
    }
  }

  async function handleRsvp(status: "CONFIRMED" | "DECLINED") {
    setRsvpLoading(true);
    try {
      const res = await fetch(`/api/matches/${id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchMatch();
        setFeedback("Presença registrada com sucesso.");
      } else {
        const data = await res.json();
        setActionError(data.error || "Erro ao registrar presença");
      }
    } catch {
      setActionError("Erro de conexão");
    } finally {
      setRsvpLoading(false);
    }
  }

  async function handleCancelConfirm() {
    setActionLoading(true);
    setActionError(null);

    const res = await fetch(`/api/matches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    if (res.ok) {
      setConfirmCancelOpen(false);
      setFeedback("Partida cancelada com sucesso.");
      await fetchMatch();
    } else {
      const data = await res.json().catch(() => ({}));
      setActionError(data.error || "Erro ao cancelar partida");
    }

    setActionLoading(false);
  }

  async function handleDeleteConfirm() {
    if (!match) return;

    setActionLoading(true);
    setActionError(null);

    const confirm_param = match.stats.length > 0 ? "?confirm=true" : "";
    const res = await fetch(`/api/matches/${id}${confirm_param}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/matches");
      return;
    }

    const data = await res.json().catch(() => ({}));
    setActionError(data.error || "Erro ao excluir partida");
    setActionLoading(false);
  }

  function handleCopyLink() {
    if (!match?.shareUrl) return;
    trackGeneralMatchShareCopy();
    navigator.clipboard.writeText(match.shareUrl).then(() => {
      setCopyMsg("Link copiado!");
      setTimeout(() => setCopyMsg(""), 2000);
    });
  }

  function trackGeneralMatchShareCopy() {
    if (!match) return;

    fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "match_share_link_copied",
        context: "dashboard_match_general",
        entityType: "match",
        entityId: match.id,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  function handleCopyRecapLink() {
    if (!match) return;
    trackRecapCtaClick("copy_link");
    const recapUrl = `${window.location.origin}/api/og/team-recap/${match.id}`;
    navigator.clipboard.writeText(recapUrl).then(() => {
      setCopyMsg("Link do recap copiado!");
      setTimeout(() => setCopyMsg(""), 2000);
    });
  }

  function trackRecapCtaClick(ctaType: "open_card" | "copy_link" | "whatsapp_share") {
    if (!match) return;

    fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "recap_cta_clicked",
        context: "dashboard_match_postgame",
        ctaType,
        entityType: "match",
        entityId: match.id,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  function getRecapCardUrl() {
    if (!match) return "";
    return `${window.location.origin}/api/og/team-recap/${match.id}`;
  }

  function handleCopyPregameRecapLink() {
    if (!match) return;
    trackPregameCtaClick("copy_link");
    const pregameRecapUrl = getPregameRecapCardUrl();
    navigator.clipboard.writeText(pregameRecapUrl).then(() => {
      setCopyMsg("Link do pré-jogo copiado!");
      setTimeout(() => setCopyMsg(""), 2000);
    });
  }

  function trackPregameCtaClick(ctaType: "open_card" | "copy_link" | "whatsapp_share") {
    if (!match) return;

    fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "pregame_cta_clicked",
        context: "dashboard_match_pregame",
        ctaType,
        entityType: "match",
        entityId: match.id,
      }),
      keepalive: true,
    }).catch(() => {});
  }

  function getPregameRecapCardUrl() {
    if (!match) return "";
    return `${window.location.origin}/api/og/pregame-recap/${match.id}`;
  }

  function buildConvocacaoText() {
    if (!match) return "";

    const dateStr = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(match.date));

    const confirmedNames = match.rsvps
      .filter((r) => r.status === "CONFIRMED")
      .map((r) => r.playerName);
    const pendingNames = match.rsvps
      .filter((r) => r.status === "PENDING")
      .map((r) => r.playerName);

    const lines: string[] = [
      `⚽ JOGO MARCADO!`,
      ``,
      `📅 ${dateStr}`,
      `📍 ${match.venue}`,
      `🏆 vs ${match.opponent}`,
      ``,
    ];

    if (confirmedNames.length > 0) {
      lines.push(`✅ Confirmados (${confirmedNames.length}): ${confirmedNames.join(", ")}`);
    }
    if (pendingNames.length > 0) {
      lines.push(`⏳ Aguardando (${pendingNames.length}): ${pendingNames.join(", ")}`);
    }

    lines.push(``, `👉 Confirme aqui: ${window.location.origin}/matches/${match.id}?t=${match.shareToken}`);
    return lines.join("\n");
  }

  function buildLineupShareText() {
    if (!match || !lineupData) return "";

    const dateStr = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(match.date));

    const formation = lineupData.lineup.meta.formation;
    const lines: string[] = [
      `⚽ ESCALAÇÃO — vs ${match.opponent}`,
      `📅 ${dateStr} | 📍 ${match.venue}`,
      ...(formation ? [`🗺️ ${formation}`] : []),
      ``,
      `👕 Titulares:`,
      ...lineupData.lineup.starters.map(
        (starter, index) => `${index + 1}. ${starter.playerName}`
      ),
    ];

    if (lineupData.lineup.bench.length > 0) {
      lines.push(
        ``,
        `🪑 Banco: ${lineupData.lineup.bench.map((b) => b.playerName).join(", ")}`
      );
    }

    lines.push(``, `🔗 Veja a partida: ${match.shareUrl}`);
    return lines.join("\n");
  }

  function buildResultText() {
    if (!match || match.homeScore === null || match.awayScore === null) return "";

    const our = match.isHome ? match.homeScore : match.awayScore;
    const opp = match.isHome ? match.awayScore : match.homeScore;
    const result = our > opp ? "✅ Vitória" : our < opp ? "❌ Derrota" : "🟡 Empate";
    const scorers = match.stats
      .filter((s) => s.goals > 0)
      .map((s) => `${s.playerName} (${s.goals})`)
      .join(", ");

    const lines = [
      `⚽ RESULTADO`,
      ``,
      `${result}: ${our} × ${opp}`,
      `🏆 vs ${match.opponent}`,
      ...(scorers ? [`⚽ Gols: ${scorers}`] : []),
      ``,
      `🖼️ Card recap: ${getRecapCardUrl()}`,
      `👉 Ver partida: ${match.shareUrl}`,
    ];
    return lines.join("\n");
  }

  if (loading) {
    return <p className="text-[var(--text-muted)]">Carregando...</p>;
  }

  if (!match) {
    return (
      <div className="space-y-4 rounded-[16px] border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] p-6 max-w-2xl mx-auto my-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="text-base font-bold text-[#fca5a5]">Erro ao carregar partida</h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              {loadError ?? "Partida não encontrada no sistema."}
            </p>
          </div>
        </div>

        {detailedError && (
          <div className="mt-4 text-left bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)] rounded-xl p-4">
            <details className="cursor-pointer group">
              <summary className="text-xs font-semibold text-[#fca5a5] hover:text-white focus:outline-none flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span>Visualizar logs e detalhes técnicos</span>
                </span>
                <span className="text-[10px] font-normal text-[#fca5a5]/70 bg-[rgba(239,68,68,0.1)] px-2 py-0.5 rounded-full group-open:hidden">
                  clique para ver logs
                </span>
              </summary>
              <div className="mt-3 overflow-x-auto rounded-lg bg-[#0a0505] p-4 font-mono text-[10px] text-red-200 border border-[rgba(239,68,68,0.3)] max-h-60 whitespace-pre-wrap leading-relaxed">
                <p className="font-bold text-red-400 mb-1">
                  [{detailedError.name || "API_ERROR"}] {detailedError.message}
                </p>
                {detailedError.status && (
                  <p className="text-red-300 font-semibold mb-1">Status Code: {detailedError.status}</p>
                )}
                {detailedError.stack && (
                  <p className="opacity-80 mt-2 text-[9px] border-t border-[rgba(239,68,68,0.3)] pt-2 leading-normal">
                    {detailedError.stack}
                  </p>
                )}
              </div>
            </details>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={fetchMatch}>
            Tentar novamente
          </Button>
          <a
            href="/dashboard/matches"
            className="inline-flex items-center justify-center rounded-[12px] text-sm font-medium transition-colors border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text)] hover:bg-white/[0.08] h-9 px-4 py-2"
          >
            Voltar para Partidas
          </a>
        </div>
      </div>
    );
  }

  const confirmed = match.rsvps.filter((r) => r.status === "CONFIRMED").length;
  const declined = match.rsvps.filter((r) => r.status === "DECLINED").length;
  const pending = match.rsvps.filter((r) => r.status === "PENDING").length;
  const isScheduled = match.status === "SCHEDULED";
  const canSeeLineup = isCoachOrAdmin && isScheduled;
  const canSeeOperations = isAdmin && (isScheduled || match.status === "COMPLETED");
  const canSeePostGame = (isAdmin && match.canSubmitPostGame) || match.status === "COMPLETED";
  const canSeeLive = isAdmin;
  const canSeeGuests = isCoachOrAdmin;
  const sections: Array<{
    id: ScheduledWorkspaceSection;
    label: string;
    helper: string;
  }> = [
    { id: "overview", label: "Resumo", helper: "Visao rapida da partida" },
    { id: "presence", label: "Presenca", helper: "RSVP e lista de respostas" },
    { id: "gallery", label: "Galeria", helper: "Fotos da partida" },
    ...(canSeeLive
      ? [{ id: "live" as const, label: "Ao Vivo", helper: "Placar e cronômetro em tempo real" }]
      : []),
    ...(canSeeGuests
      ? [{ id: "guests" as const, label: "Convidados", helper: "Jogadores convidados do jogo" }]
      : []),
    ...(canSeeLineup
      ? [{ id: "lineup" as const, label: "Escalacao", helper: "Sugestao inicial do jogo" }]
      : []),
    ...(canSeeOperations
      ? [{ id: "operations" as const, label: "Operacao", helper: "Bordero e despesas" }]
      : []),
    ...(canSeePostGame
      ? [{ id: "postgame" as const, label: "Pos-jogo", helper: "Placar, estatisticas e compartilhamento" }]
      : []),
    ...(match.hasCharge
      ? [{ id: "charges" as const, label: "Cobrança", helper: "Controle de pagamentos do jogo" }]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/matches")}
            className="mb-2 text-sm text-[var(--brand-neon)] hover:text-white transition-colors"
          >
            ← Voltar para Jogos
          </button>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            vs {match.opponent}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant={statusVariants[match.status]}>
              {statusLabels[match.status]}
            </Badge>
            <Badge variant="default">
              {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
            </Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleCopyLink}>
            🖗 Compartilhar
          </Button>
          {isAdmin && (
            <Button variant="secondary" onClick={() => setShowEditMatch(true)}>
              Editar partida
            </Button>
          )}
          {isAdmin && match.status === "COMPLETED" && (
            <Button variant="secondary" onClick={() => setShowEditPostGame(true)}>
              Editar pos-jogo
            </Button>
          )}
          {isAdmin && match.status === "SCHEDULED" && (
            <Button
              variant="secondary"
              onClick={() => {
                const next = !showConvocacao;
                setShowConvocacao(next);
                if (next && match) {
                  setConvocacaoText(buildConvocacaoText());
                }
              }}
            >
              📋 Gerar Convocação
            </Button>
          )}
          {isAdmin && match.status === "SCHEDULED" && (
            <Button variant="danger" onClick={() => setConfirmCancelOpen(true)}>
              Cancelar Partida
            </Button>
          )}
          {isAdmin && (
            <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)}>
              Excluir
            </Button>
          )}
        </div>
      </div>

      {copyMsg && (
        <div className="rounded-[12px] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-3 text-sm text-[#6ee7b7] font-semibold">
          {copyMsg}
        </div>
      )}

      {/* F-007: WhatsApp convocation generator */}
      {isAdmin && showConvocacao && match.status === "SCHEDULED" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Convocação para WhatsApp</h2>
              <button
                onClick={() => setShowConvocacao(false)}
                className="rounded-md px-2 py-1 text-sm text-[var(--text-muted)] hover:bg-white/[0.06] hover:text-[var(--text)] transition-colors"
                aria-label="Fechar convocação"
              >
                Fechar
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <textarea
              className="min-h-[180px] w-full rounded-lg border border-[var(--border)] bg-[#090f0c] p-4 font-sans text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              value={convocacaoText}
              onChange={(e) => setConvocacaoText(e.target.value)}
              aria-label="Texto da convocação"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(convocacaoText);
                  setCopyMsg("Convocação copiada!");
                  setTimeout(() => setCopyMsg(""), 2500);
                }}
              >
                📋 Copiar texto
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(convocacaoText)}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                📱 Abrir no WhatsApp
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConvocacaoText(buildConvocacaoText())}
              >
                🔄 Regenerar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {feedback && (
        <div className="rounded-[12px] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-3 text-sm text-[#6ee7b7] font-semibold">
          {feedback}
        </div>
      )}

      {actionError && (
        <div className="rounded-[12px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] p-3 text-sm text-[#fca5a5] font-semibold">
          {actionError}
        </div>
      )}

      {/* Match Info */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Informações</h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-sm text-[var(--text-muted)]">Data</span>
              <p className="font-medium text-[var(--text)]">{formatMatchDate(match.date)}</p>
            </div>
            <div>
              <span className="text-sm text-[var(--text-muted)]">Local</span>
              <p className="font-medium text-[var(--text)]">{match.venue}</p>
            </div>
            <div>
              <span className="text-sm text-[var(--text-muted)]">Adversário</span>
              <p className="font-medium text-[var(--text)]">{match.opponent}</p>
            </div>
            <div>
              <span className="text-sm text-[var(--text-muted)]">Tipo</span>
              <p className="font-medium text-[var(--text)]">
                {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
              </p>
            </div>
            <div>
              <span className="text-sm text-[var(--text-muted)]">Mando</span>
              <p className="font-medium text-[var(--text)]">{match.isHome ? "Casa" : "Visitante"}</p>
            </div>
            <div>
              <span className="text-sm text-[var(--text-muted)]">Escudo adversário</span>
              <p className="font-medium text-[var(--text)]">{match.opponentBadgeUrl ? "Definido" : "Nao informado"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {(isScheduled || canSeePostGame) && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)]">Central da partida</h2>
                <p className="text-sm text-[var(--text-subtle)]">
                  Separamos presenca, escalacao e operacao para a pagina ficar mais objetiva.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    type="button"
                    variant={activeSection === section.id ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <button
                type="button"
                onClick={() => setActiveSection("overview")}
                className={`rounded-[14px] border p-4 text-left transition-colors ${
                  activeSection === "overview"
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white/[0.07]"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Resumo</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text)]">Tudo em contexto</p>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">Visao rapida da rodada e proximos passos.</p>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("presence")}
                className={`rounded-[14px] border p-4 text-left transition-colors ${
                  activeSection === "presence"
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white/[0.07]"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Presenca</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text)]">{confirmed} confirmados</p>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">{pending} pendentes e {declined} recusas.</p>
              </button>

              {canSeeLineup && (
                <button
                  type="button"
                  onClick={() => setActiveSection("lineup")}
                  className={`rounded-[14px] border p-4 text-left transition-colors ${
                    activeSection === "lineup"
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white/[0.07]"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Escalacao</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {lineupLoading ? "Calculando..." : `${lineupData?.lineup?.starters?.length ?? 0} titulares`}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">
                    {lineupError ? "Revise o erro da leitura" : "Veja a sugestao sem inflar a pagina principal."}
                  </p>
                </button>
              )}

              {canSeeOperations && (
                <button
                  type="button"
                  onClick={() => setActiveSection("operations")}
                  className={`rounded-[14px] border p-4 text-left transition-colors ${
                    activeSection === "operations"
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white/[0.07]"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Operacao</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {bordereauLoading ? "Carregando..." : `${bordereauData?.costSummary?.presentCount ?? 0} presentes`}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">
                    Bordero e despesas ficam isolados do RSVP.
                  </p>
                </button>
              )}

              {canSeePostGame && (
                <button
                  type="button"
                  onClick={() => setActiveSection("postgame")}
                  className={`rounded-[14px] border p-4 text-left transition-colors ${
                    activeSection === "postgame"
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white/[0.07]"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Pos-jogo</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {match.status === "COMPLETED" ? "Partida finalizada" : "Registro pendente"}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">
                    Placar, estatisticas e compartilhamento em uma area dedicada.
                  </p>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveSection("gallery")}
                className={`rounded-[14px] border p-4 text-left transition-colors ${
                  activeSection === "gallery"
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white/[0.07]"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Galeria</p>
                <p className="mt-2 text-lg font-semibold text-[var(--text)]">Fotos do jogo</p>
                <p className="mt-1 text-sm text-[var(--text-subtle)]">Resenha e fotos da partida.</p>
              </button>

              {match.hasCharge && (
                <button
                  type="button"
                  onClick={() => setActiveSection("charges")}
                  className={`rounded-[14px] border p-4 text-left transition-colors ${
                    activeSection === "charges"
                      ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-soft)] hover:bg-white/[0.07]"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Cobrança</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text)]">
                    {match.chargeAmount != null ? formatCurrency(match.chargeAmount) : "Taxa de jogo"}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">
                    Acompanhe quem pagou a taxa deste jogo.
                  </p>
                </button>
              )}
            </div>

            <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">
                {sections.find((section) => section.id === activeSection)?.label ?? ""}
              </p>
              <p className="mt-1 text-sm text-[var(--text-subtle)]">
                {sections.find((section) => section.id === activeSection)?.helper ?? ""}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isScheduled && activeSection === "overview" && (
        <>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-[var(--text)]">Visao geral do jogo</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Confirmacoes</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{confirmed}</p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">Jogadores que ja confirmaram presenca.</p>
                </div>
                <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Pendencias</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{pending}</p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">Ainda sem resposta no RSVP.</p>
                </div>
                <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2a6f60]">Recusas</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{declined}</p>
                  <p className="mt-1 text-sm text-[var(--text-subtle)]">Atletas indisponiveis para esta partida.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <h2 className="text-lg font-semibold text-[var(--text)]">Divulgar Pré-Jogo nas Redes Sociais</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#6ee7b7]">Gerar Imagem de Pré-Jogo</p>
                  <p className="text-sm text-[var(--text-subtle)]">
                    Crie um card de preview personalizado com local, horário, convocados e retrospectiva do time para publicar no Instagram e WhatsApp!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const pregameUrl = getPregameRecapCardUrl();
                      if (!pregameUrl) return;
                      trackPregameCtaClick("open_card");
                      window.open(
                        pregameUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    🖼️ Abrir card pré-jogo
                  </Button>
                  <Button variant="secondary" onClick={handleCopyPregameRecapLink}>
                    📋 Copiar link do card
                  </Button>
                  <Button
                    onClick={() => {
                      trackPregameCtaClick("whatsapp_share");
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(buildConvocacaoText())}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    📱 Compartilhar no WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Score (if completed) */}
      {activeSection === "postgame" && match.status === "COMPLETED" &&
        match.homeScore !== null &&
        match.awayScore !== null && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Placar</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-10 text-3xl font-bold text-center">
                <div className="space-y-1">
                  <span className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {match.isHome ? "Nosso Time (Casa)" : `${match.opponent} (Casa)`}
                  </span>
                  <span className={`${match.isHome ? "text-[#6ee7b7]" : "text-[#fca5a5]"} text-4xl block font-black`}>
                    {match.homeScore}
                  </span>
                </div>
                <span className="text-[var(--text-muted)] self-end pb-1">x</span>
                <div className="space-y-1">
                  <span className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {match.isHome ? `${match.opponent} (Visitante)` : "Nosso Time (Visitante)"}
                  </span>
                  <span className={`${match.isHome ? "text-[#fca5a5]" : "text-[#6ee7b7]"} text-4xl block font-black`}>
                    {match.awayScore}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* RSVP Summary and Actions */}
      {match.status === "SCHEDULED" && activeSection === "presence" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Confirmação de Presença</h2>
              <div className="flex gap-3 text-sm">
                <span className="text-green-600">✅ {confirmed}</span>
                <span className="text-red-600">❌ {declined}</span>
                <span className="text-yellow-600">⏳ {pending}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* RSVP action buttons for players */}
            <div className="mb-4 flex gap-3">
              <Button
                onClick={() => handleRsvp("CONFIRMED")}
                disabled={rsvpLoading}
              >
                ✅ Confirmar Presença
              </Button>
              <Button
                variant="danger"
                onClick={() => handleRsvp("DECLINED")}
                disabled={rsvpLoading}
              >
                ❌ Recusar
              </Button>
            </div>

            {/* RSVP list */}
            <div className="space-y-2">
              {match.rsvps.map((rsvp) => (
                <div
                  key={rsvp.playerId}
                  className="flex items-center justify-between rounded-[12px] border border-white/5 bg-white/[0.04] px-4 py-2 hover:bg-white/[0.07] transition-colors"
                >
                  <span className="font-medium text-[var(--text)]">
                    {rsvp.playerName}
                  </span>
                  <Badge variant={rsvpStatusVariants[rsvp.status]}>
                    {rsvpStatusLabels[rsvp.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RSVP list for non-scheduled matches */}
      {match.status !== "SCHEDULED" && match.rsvps.length > 0 && activeSection === "presence" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Presenças</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {match.rsvps.map((rsvp) => (
                <div
                  key={rsvp.playerId}
                  className="flex items-center justify-between rounded-[12px] border border-white/5 bg-white/[0.04] px-4 py-2 hover:bg-white/[0.07] transition-colors"
                >
                  <span className="font-medium text-[var(--text)]">
                    {rsvp.playerName}
                  </span>
                  <Badge variant={rsvpStatusVariants[rsvp.status]}>
                    {rsvpStatusLabels[rsvp.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {canSeeLineup && activeSection === "lineup" && lineupData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Compartilhar Escalação</h2>
              <button
                onClick={() => {
                  const next = !showLineupShare;
                  setShowLineupShare(next);
                  if (next) setLineupShareText(buildLineupShareText());
                }}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--brand-neon)] hover:bg-white/[0.06] transition-colors"
              >
                {showLineupShare ? "Fechar" : "📋 Gerar texto"}
              </button>
            </div>
          </CardHeader>
          {showLineupShare && (
            <CardContent>
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-[var(--border)] bg-[#090f0c] p-4 font-sans text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
                value={lineupShareText}
                onChange={(e) => setLineupShareText(e.target.value)}
                aria-label="Texto da escalação para compartilhar"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(lineupShareText);
                    setCopyMsg("Escalação copiada!");
                    setTimeout(() => setCopyMsg(""), 2500);
                  }}
                >
                  📋 Copiar texto
                </Button>
                <Button
                  onClick={() => {
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(lineupShareText)}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  📱 Enviar no WhatsApp
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setLineupShareText(buildLineupShareText())}
                >
                  🔄 Regenerar
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {canSeeLineup && activeSection === "lineup" && (
        <SuggestedLineupCard
          loading={lineupLoading}
          error={lineupError}
          lineup={lineupData?.lineup ?? null}
          generatedAt={lineupData?.generatedAt ?? null}
          onRefresh={() => fetchLineup({ refresh: true })}
          canRefresh={!lineupRefreshing}
          onSaveLineup={handleSaveLineup}
          onResetSavedLineup={handleResetSavedLineup}
          saveLoading={lineupSaving}
          imageUrl={lineupData?.imageUrl ?? null}
        />
      )}

      {canSeeLive && activeSection === "live" && (
        <LiveMatchControl matchId={match.id} />
      )}

      {canSeeGuests && activeSection === "guests" && (
        <GuestPlayersManager matchId={match.id} />
      )}

      {activeSection === "gallery" && (
        <MatchPhotosGallery matchId={match.id} opponent={match.opponent} />
      )}

      {canSeeOperations && activeSection === "operations" && (
        <div className="space-y-6">
          <BordereauCard
            loading={bordereauLoading}
            saving={bordereauSaving}
            error={bordereauError}
            data={bordereauData}
            onChecklistToggle={toggleChecklistItem}
            onAttendanceToggle={toggleAttendance}
            onShirtNumberChange={handleShirtNumberChange}
            onSave={handleSaveBordereau}
            onOpenExpense={() => setExpenseModalOpen(true)}
          />
          <MatchEquipmentCard matchId={match.id} />
        </div>
      )}

      {match.hasCharge && activeSection === "charges" && (
        <Card className="rounded-[18px]">
          <CardHeader>
            <div className="flex flex-col justify-between gap-2 border-b border-white/5 pb-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-white">Controle de Pagamentos</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Taxa definida por atleta: <strong className="text-[#34d399]">{match.chargeAmount != null ? formatCurrency(match.chargeAmount) : "R$ 0,00"}</strong>
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm mt-2 sm:mt-0">
                <div className="rounded-xl bg-white/[0.02] border border-white/5 px-4 py-2 text-center">
                  <p className="text-xs text-[var(--text-muted)]">Arrecadado</p>
                  <p className="text-lg font-black text-[#34d399] mt-0.5">
                    {formatCurrency(
                      checklistPlayers
                        .filter((p) => p.payment)
                        .reduce((sum, p) => sum + (match.chargeAmount || 0), 0)
                    )}
                  </p>
                </div>
                <div className="rounded-xl bg-white/[0.02] border border-white/5 px-4 py-2 text-center">
                  <p className="text-xs text-[var(--text-muted)]">Pagos</p>
                  <p className="text-lg font-black text-white mt-0.5">
                    {checklistPlayers.filter((p) => p.payment).length} <span className="text-xs font-normal text-[var(--text-muted)]">/ {checklistPlayers.length}</span>
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {chargesFeedback && (
              <div className="rounded-[12px] border border-[#bde0d3] bg-[#e9f8f1] p-3 text-sm text-[#1d5f4f]">
                {chargesFeedback}
              </div>
            )}

            {chargesError && (
              <div className="rounded-[12px] border border-[#efc1b7] bg-[#fff1ee] p-3 text-sm text-[var(--danger)]">
                {chargesError}
              </div>
            )}

            {checklistLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#10b981] border-t-transparent" />
              </div>
            ) : checklistPlayers.length === 0 ? (
              <p className="text-center py-8 text-[var(--text-muted)]">Nenhum jogador ativo no elenco.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {checklistPlayers.map((p) => {
                  const isPaid = !!p.payment;
                  const isToggling = togglingPlayerId === p.id;
                  
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-soft)] text-sm font-black text-[var(--brand)] border border-[var(--brand)]/20">
                          {p.shirtNumber || "—"}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{p.name}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {p.present ? (
                              <Badge variant="success" className="text-[10px] px-1.5 py-0.5">Presente</Badge>
                            ) : p.rsvp === "CONFIRMED" ? (
                              <Badge variant="info" className="text-[10px] px-1.5 py-0.5">Confirmou RSVP</Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {isAdmin ? (
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isPaid}
                            disabled={isToggling}
                            onChange={(e) => handleTogglePayment(p.id, e.target.checked)}
                            className="sr-only peer"
                            aria-label={`Toggle payment for ${p.name}`}
                          />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand)]"></div>
                        </label>
                      ) : (
                        <div>
                          {isPaid ? (
                            <Badge variant="success" className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2.5 py-1">Pago ✅</Badge>
                          ) : (
                            <Badge variant="warning" className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs px-2.5 py-1">Pendente ⏳</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Post-game form (T042) — show when canSubmitPostGame is true */}
      {activeSection === "postgame" && isAdmin && match.canSubmitPostGame && !showPostGame && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-orange-800">
                  Pós-jogo disponível
                </p>
                <p className="text-sm text-orange-600">
                  A data da partida já passou. Registre o placar e as
                  estatísticas.
                </p>
              </div>
              <Button onClick={() => setShowPostGame(true)}>
                Registrar Pós-Jogo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === "postgame" && isAdmin && match.canSubmitPostGame && showPostGame && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Registrar Pós-Jogo</h2>
          </CardHeader>
          <CardContent>
            <PostGameForm
              matchId={match.id}
              rsvps={match.rsvps}
              initialIsHome={match.isHome}
              onSuccess={() => {
                setShowPostGame(false);
                fetchMatch();
              }}
              onCancel={() => setShowPostGame(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Stats display (when match is COMPLETED and has stats) */}
      {activeSection === "postgame" && match.status === "COMPLETED" && match.stats.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Estatísticas Individuais</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 font-medium text-gray-500">Jogador</th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      Gols
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      Assist.
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      🟨
                    </th>
                    <th className="pb-2 text-center font-medium text-gray-500">
                      🟥
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {match.stats.map((stat) => (
                    <tr
                      key={stat.playerId}
                      className="border-b border-gray-100"
                    >
                      <td className="py-2 font-medium">{stat.playerName}</td>
                      <td className="py-2 text-center">{stat.goals}</td>
                      <td className="py-2 text-center">{stat.assists}</td>
                      <td className="py-2 text-center">{stat.yellowCards}</td>
                      <td className="py-2 text-center">{stat.redCards}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teammate Ratings Card */}
      {activeSection === "postgame" && match.status === "COMPLETED" && match.stats.length > 0 && (
        <Card className="rounded-[22px] border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="text-[#34d399]">⭐</span> Avaliação dos Companheiros
                </h2>
                <p className="text-xs text-[#8fa39b] mt-1">
                  Atribua notas de 1 a 5 estrelas para os atletas que participaram desta partida.
                </p>
              </div>
              {!canRate && (
                <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-400">
                  Somente Participantes
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {!canRate && (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-4 text-center">
                <p className="text-sm font-semibold text-white/80">Avaliação Restrita</p>
                <p className="text-xs text-[#8fa39b] mt-1">
                  Apenas os administradores, comissão técnica ou jogadores que participaram da partida (súmula ou presença confirmada) podem avaliar o time.
                </p>
              </div>
            )}
            
            {ratingsLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl border border-white/5 bg-white/[0.01]" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {match.stats.map((stat) => {
                  const userRating = userRatings.find((r) => r.playerId === stat.playerId)?.stars ?? null;
                  const avgData = ratingsAverages.find((r) => r.playerId === stat.playerId);
                  const averageRating = avgData?.averageStars ?? 0;
                  const totalRatings = avgData?.totalRatings ?? 0;

                  return (
                    <TeammateRatingRow
                      key={stat.playerId}
                      player={stat}
                      currentUserPlayerId={session?.user?.playerId ?? null}
                      userRating={userRating}
                      averageRating={averageRating}
                      totalRatings={totalRatings}
                      canRate={canRate}
                      onRate={(stars) => handleRateTeammate(stat.playerId, stars)}
                      isSubmitting={submittingRatingId === stat.playerId}
                    />
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* F-002: Share result card */}
      {activeSection === "postgame" && match.status === "COMPLETED" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recap da Rodada</h2>
          </CardHeader>
          <CardContent>
            <TeamRecapWidget matchId={match.id} />
          </CardContent>
        </Card>
      )}

      {activeSection === "postgame" && match.status === "COMPLETED" &&
        match.stats.length > 0 &&
        match.homeScore !== null &&
        match.awayScore !== null && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent>
              <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-blue-800">Compartilhar resultado</p>
                  <p className="text-sm text-blue-600">
                    {match.isHome ? match.homeScore : match.awayScore} × {match.isHome ? match.awayScore : match.homeScore} vs {match.opponent} — divulgue o card de resultado!
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const recapUrl = getRecapCardUrl();
                      if (!recapUrl) return;
                      trackRecapCtaClick("open_card");
                      window.open(
                        recapUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    🖼️ Abrir card recap
                  </Button>
                  <Button variant="secondary" onClick={handleCopyRecapLink}>
                    📋 Copiar link do recap
                  </Button>
                  <Button variant="secondary" onClick={handleCopyLink}>
                    🔗 Copiar link
                  </Button>
                  <Button
                    onClick={() => {
                      trackRecapCtaClick("whatsapp_share");
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(buildResultText())}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    📱 Compartilhar no WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      <Modal
        open={isAdmin && confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        title="Cancelar partida"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Tem certeza que deseja cancelar esta partida?
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleCancelConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Cancelando..." : "Confirmar cancelamento"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setConfirmCancelOpen(false)}
              disabled={actionLoading}
            >
              Voltar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isAdmin && confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Excluir partida"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {match.stats.length > 0
              ? "Esta partida possui estatísticas e será excluída permanentemente. Deseja continuar?"
              : "Deseja excluir esta partida permanentemente?"}
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? "Excluindo..." : "Confirmar exclusão"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={actionLoading}
            >
              Voltar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isAdmin && showEditMatch}
        onClose={() => setShowEditMatch(false)}
        title="Editar partida"
      >
        <MatchForm
          defaultValues={{
            id: match.id,
            date: match.date,
            venue: match.venue,
            opponent: match.opponent,
            isHome: match.isHome,
            opponentBadgeUrl: match.opponentBadgeUrl,
            type: match.type,
            seasonId: match.season?.id,
            positionLimits: match.positionLimits,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
          }}
          onSuccess={async () => {
            setShowEditMatch(false);
            await fetchMatch();
            setFeedback("Informacoes da partida atualizadas com sucesso.");
          }}
          onCancel={() => setShowEditMatch(false)}
        />
      </Modal>

      <Modal
        open={isAdmin && showEditPostGame && match.status === "COMPLETED"}
        onClose={() => setShowEditPostGame(false)}
        title="Editar pos-jogo"
      >
        <PostGameForm
          mode="edit"
          matchId={match.id}
          rsvps={match.rsvps}
          initialHomeScore={match.homeScore}
          initialAwayScore={match.awayScore}
          initialStats={match.stats}
          initialIsHome={match.isHome}
          opponentBadgeUrl={match.opponentBadgeUrl}
          allowOpponentBadgeEdit={!match.opponentBadgeUrl}
          allowIsHomeEdit
          onSuccess={async () => {
            setShowEditPostGame(false);
            await fetchMatch();
            setFeedback("Pos-jogo atualizado com sucesso.");
          }}
          onCancel={() => setShowEditPostGame(false)}
        />
      </Modal>

      <Modal
        open={isAdmin && expenseModalOpen && !!match}
        onClose={() => setExpenseModalOpen(false)}
        title="Lancar despesa da partida"
      >
        {match && (
          <TransactionForm
            defaultType="EXPENSE"
            defaultCategory="REFEREE"
            defaultDescriptionPrefix={`Partida vs ${match.opponent}`}
            hideTypeSelector
            matchId={match.id}
            onSuccess={async () => {
              setExpenseModalOpen(false);
              await fetchBordereau();
              setFeedback("Despesa vinculada a partida registrada com sucesso.");
            }}
            onCancel={() => setExpenseModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
