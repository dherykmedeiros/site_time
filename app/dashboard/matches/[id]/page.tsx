"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { MatchOverviewTab } from "@/components/matches/MatchOverviewTab";
import { MatchRsvpTab } from "@/components/matches/MatchRsvpTab";
import { MatchLineupTab } from "@/components/matches/MatchLineupTab";
import { MatchBordereauTab } from "@/components/matches/MatchBordereauTab";
import { MatchLiveTab } from "@/components/matches/MatchLiveTab";
import { MatchRatingTab } from "@/components/matches/MatchRatingTab";
import { MatchGalleryTab } from "@/components/matches/MatchGalleryTab";
import type { BordereauResponse, SuggestedLineupResponse } from "@/lib/validations/match";
import { Star, Copy, Check, Upload, Eye, FileText, CheckCircle2, XCircle, AlertCircle, Coins, MapPin, Calendar, Users, LayoutGrid, Settings, Trophy, Camera, Radio, UserPlus, MoreVertical, ExternalLink, ChevronDown } from "lucide-react";
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



export interface RSVP {
  playerId: string;
  playerName: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  respondedAt: string | null;
  summoned?: boolean;
  isGuest?: boolean;
  guestPlayerId?: string | null;
  isSuspended?: boolean;
}

export interface PlayerStat {
  playerId: string;
  guestPlayerId?: string | null;
  playerName: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface MatchDetail {
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
  isPlayerSuspended?: boolean;
  suspensionReason?: string | null;
  rsvps: RSVP[];
  stats: PlayerStat[];
  canSubmitPostGame: boolean;
  hasCharge: boolean;
  chargeAmount: number | null;
  requiresDocumentDetails?: boolean;
  pixKey: string | null;
  season?: { id: string; name: string; type: string; status: string } | null;
  positionLimits?: Array<{ position: string; maxPlayers: number }>;
  latitude?: number | null;
  longitude?: number | null;
  userAttendance?: { present: boolean; checkedInAt: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface MatchLineupResponse {
  matchId: string;
  generatedAt: string;
  imageUrl: string;
  lineup: SuggestedLineupResponse;
}

export type ScheduledWorkspaceSection = "overview" | "presence" | "lineup" | "operations" | "postgame" | "gallery" | "live" | "guests" | "charges";

const sectionIcons: Record<ScheduledWorkspaceSection, React.ReactNode> = {
  overview: <LayoutGrid className="h-4 w-4" />,
  presence: <Users className="h-4 w-4" />,
  lineup: <LayoutGrid className="h-4 w-4" />,
  operations: <Settings className="h-4 w-4" />,
  postgame: <Trophy className="h-4 w-4" />,
  gallery: <Camera className="h-4 w-4" />,
  live: <Radio className="h-4 w-4" />,
  guests: <UserPlus className="h-4 w-4" />,
  charges: <Coins className="h-4 w-4" />,
};

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
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [checkInFeedback, setCheckInFeedback] = useState<string | null>(null);
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
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Player of the match votes state
  const [votesData, setVotesData] = useState<{
    results: Array<{ playerId: string; playerName: string; photoUrl: string | null; shirtNumber: number; position: string; voteCount: number }>;
    hasVoted: boolean;
    votedForId: string | null;
  } | null>(null);
  const [votesLoading, setVotesLoading] = useState(false);
  const [votingForId, setVotingForId] = useState<string>("");
  const [submitVoteLoading, setSubmitVoteLoading] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  // Match Charges state inside the match detail page
  const [checklistPlayers, setChecklistPlayers] = useState<any[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(false);
  const [togglingPlayerId, setTogglingPlayerId] = useState<string | null>(null);
  const [chargesFeedback, setChargesFeedback] = useState<string | null>(null);
  const [chargesError, setChargesError] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [previewReceipt, setPreviewReceipt] = useState<{ url: string; playerName: string; playerId: string } | null>(null);
  const [pixKeyCopied, setPixKeyCopied] = useState(false);

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

  const handleUploadReceipt = async (e: React.ChangeEvent<HTMLInputElement>, playerId: string) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setUploadingReceipt(true);
    setChargesError(null);
    setChargesFeedback(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setChargesError(uploadData.error || "Erro ao enviar arquivo do comprovante");
        return;
      }

      const receiptUrl = uploadData.url;

      const res = await fetch(`/api/matches/${id}/charges/receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, receiptUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setChargesFeedback("Comprovante enviado com sucesso! Aguardando aprovação da administração.");
        loadChecklistPlayers();
      } else {
        setChargesError(data.error || "Erro ao registrar o comprovante");
      }
    } catch (err) {
      setChargesError("Erro ao enviar o comprovante de pagamento");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleApproveReceipt = async (playerId: string) => {
    if (!id) return;
    setTogglingPlayerId(playerId);
    setChargesError(null);
    setChargesFeedback(null);
    try {
      const res = await fetch(`/api/matches/${id}/charges/${playerId}/approve`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setChargesFeedback("Pagamento aprovado com sucesso!");
        loadChecklistPlayers();
        setPreviewReceipt(null);
      } else {
        setChargesError(data.error || "Erro ao aprovar o comprovante");
      }
    } catch (err) {
      setChargesError("Erro de conexão ao aprovar o comprovante");
    } finally {
      setTogglingPlayerId(null);
    }
  };

  const handleRejectReceipt = async (playerId: string) => {
    if (!id) return;
    setTogglingPlayerId(playerId);
    setChargesError(null);
    setChargesFeedback(null);
    try {
      const res = await fetch(`/api/matches/${id}/charges/${playerId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setChargesFeedback("Comprovante recusado com sucesso.");
        loadChecklistPlayers();
        setPreviewReceipt(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setChargesError(data.error || "Erro ao recusar o comprovante");
      }
    } catch (err) {
      setChargesError("Erro de conexão ao recusar o comprovante");
    } finally {
      setTogglingPlayerId(null);
    }
  };

  const copyPixKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setPixKeyCopied(true);
    setTimeout(() => setPixKeyCopied(false), 2000);
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

  const fetchVotes = useCallback(async () => {
    if (!match || match.status !== "COMPLETED") return;
    setVotesLoading(true);
    setVoteError(null);
    try {
      const res = await fetch(`/api/matches/${id}/votes`);
      if (res.ok) {
        const data = await res.json();
        setVotesData(data);
      }
    } catch (err) {
      console.error("Erro ao buscar votos:", err);
    } finally {
      setVotesLoading(false);
    }
  }, [id, match]);

  useEffect(() => {
    if (activeSection === "postgame" && match?.status === "COMPLETED") {
      fetchRatings();
      fetchVotes();
    }
  }, [activeSection, match?.status, fetchRatings, fetchVotes]);

  async function handleCastVote() {
    if (!votingForId) return;
    setSubmitVoteLoading(true);
    setVoteError(null);
    try {
      const res = await fetch(`/api/matches/${id}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votedId: votingForId }),
      });
      const data = await res.json();
      if (res.ok) {
        setVotingForId("");
        await fetchVotes();
      } else {
        setVoteError(data.error || "Erro ao registrar voto");
      }
    } catch (err) {
      setVoteError("Erro de conexão ao enviar voto");
    } finally {
      setSubmitVoteLoading(false);
    }
  }

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

  async function handleRsvp(status: "CONFIRMED" | "DECLINED", docDetails?: { fullName?: string; cpf?: string }) {
    setRsvpLoading(true);
    try {
      const res = await fetch(`/api/matches/${id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...docDetails }),
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

  const handleCheckIn = () => {
    if (!navigator.geolocation) {
      setCheckInError("Geolocalização não é suportada ou requer conexão segura (HTTPS).");
      return;
    }

    setCheckInLoading(true);
    setCheckInError(null);
    setCheckInFeedback(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`/api/matches/${id}/check-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setCheckInFeedback(data.message);
            await fetchMatch();
          } else {
            setCheckInError(data.error || "Erro ao realizar check-in");
          }
        } catch {
          setCheckInError("Erro de conexão com o servidor");
        } finally {
          setCheckInLoading(false);
        }
      },
      (error) => {
        let msg = "Erro ao obter localização";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Permissão de localização negada. Ative a permissão de localização nas configurações do seu navegador (clique no ícone de cadeado ao lado do endereço do site) e tente novamente.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Localização indisponível no dispositivo";
        } else if (error.code === error.TIMEOUT) {
          msg = "Tempo limite esgotado ao obter localização";
        }
        setCheckInError(msg);
        setCheckInLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
      router.push("/dashboard/matches");
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
      lines.push(`✅ Confirmados (${confirmedNames.length}):`);
      lines.push(...confirmedNames.map((name) => `▪️ ${name}`));
      lines.push(``);
    }
    if (pendingNames.length > 0) {
      lines.push(`⏳ Aguardando (${pendingNames.length}):`);
      lines.push(...pendingNames.map((name) => `▫️ ${name}`));
      lines.push(``);
    }

    lines.push(`👉 Confirme aqui: ${window.location.origin}/matches/${match.id}?t=${match.shareToken}`);
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
        `🪑 Banco:`,
        ...lineupData.lineup.bench.map((b) => `▫️ ${b.playerName}`)
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
      .map((s) => `${s.playerName} (${s.goals})`);

    const lines = [
      `⚽ RESULTADO`,
      ``,
      `${result}: ${our} × ${opp}`,
      `🏆 vs ${match.opponent}`,
    ];

    if (scorers.length > 0) {
      lines.push(``, `⚽ Gols:`, ...scorers.map((s) => `▪️ ${s}`));
    }

    lines.push(
      ``,
      `🖼️ Card recap: ${getRecapCardUrl()}`,
      `👉 Ver partida: ${match.shareUrl}`
    );
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
  
  // Check-in only open starting 1 hour before kickoff
  const matchTimeMs = new Date(match.date).getTime();
  const currentTimeMs = new Date().getTime();
  const oneHourInMs = 1 * 60 * 60 * 1000;
  const isCheckInOpen = currentTimeMs >= (matchTimeMs - oneHourInMs);

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
    { id: "overview", label: "Resumo", helper: "Visão rápida da partida" },
    { id: "presence", label: "Presença", helper: "RSVP e convidados da partida" },
    { id: "gallery", label: "Galeria", helper: "Fotos da partida" },
    ...(canSeeLive
      ? [{ id: "live" as const, label: "Ao Vivo", helper: "Placar e cronômetro em tempo real" }]
      : []),
    ...(canSeeLineup
      ? [{ id: "lineup" as const, label: "Escalação", helper: "Sugestão tática do jogo" }]
      : []),
    ...(canSeeOperations || match.hasCharge
      ? [{ id: "operations" as const, label: "Financeiro", helper: "Bordero e pagamentos" }]
      : []),
    ...(canSeePostGame
      ? [{ id: "postgame" as const, label: "Pós-jogo", helper: "Estatísticas e avaliações" }]
      : []),
  ];



  return (
    <div className="space-y-5">
      {/* ── Hero Header ─────────────────────────────────────── */}
      <div className="relative rounded-[20px] border border-white/[0.06] bg-gradient-to-br from-[#0c1a14] via-[#0a1510] to-[#081210] p-5 sm:p-6">
        {/* Decorative gradient orbs wrapper (handles overflow-hidden for orbs) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[rgba(16,185,129,0.06)] blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-[rgba(52,211,153,0.04)] blur-2xl" />
        </div>

        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard/matches")}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#34d399] hover:text-white transition-colors tracking-wide uppercase"
        >
          ← Voltar para Jogos
        </button>

        {/* Match title row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            {match.opponentBadgeUrl ? (
              <img
                src={match.opponentBadgeUrl}
                alt={match.opponent}
                className="h-14 w-14 rounded-xl border border-white/10 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl font-black text-white/30">
                VS
              </div>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                vs {match.opponent}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge variant={statusVariants[match.status]}>
                  {statusLabels[match.status]}
                </Badge>
                <Badge variant="default">
                  {match.type === "FRIENDLY" ? "Amistoso" : "Campeonato"}
                </Badge>
                <Badge variant="default">
                  {match.isHome ? "🏠 Casa" : "✈️ Visitante"}
                </Badge>
                {match.season && (
                  <Badge variant="default">{match.season.name}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Scoreboard (completed matches) */}
          {match.status === "COMPLETED" && match.homeScore !== null && match.awayScore !== null && (
            <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-black/30 px-5 py-3 backdrop-blur-sm">
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
                  {match.isHome ? "NÓS" : "ADV"}
                </span>
                <span className={`block text-3xl font-black mt-0.5 ${match.isHome ? "text-[#6ee7b7]" : "text-[#fca5a5]"}`}>
                  {match.homeScore}
                </span>
              </div>
              <span className="text-lg font-bold text-white/20">×</span>
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#8fa39b]">
                  {match.isHome ? "ADV" : "NÓS"}
                </span>
                <span className={`block text-3xl font-black mt-0.5 ${match.isHome ? "text-[#fca5a5]" : "text-[#6ee7b7]"}`}>
                  {match.awayScore}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Meta info strip */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#8fa39b]">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#34d399]" />
            {formatMatchDate(match.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#34d399]" />
            {match.venue}
            {match.latitude && match.longitude && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${match.latitude},${match.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[#34d399] hover:underline ml-1"
              >
                <ExternalLink className="h-3 w-3" /> Mapa
              </a>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#34d399]" />
            {confirmed} confirmados · {pending} pendentes
          </span>
        </div>

        {/* Actions bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.04] pt-4">
          <Button size="sm" variant="secondary" onClick={handleCopyLink}>
            <Copy className="h-3.5 w-3.5 mr-1.5" /> Compartilhar
          </Button>

          {isAdmin && (
            <div className="relative">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              >
                <MoreVertical className="h-3.5 w-3.5 mr-1.5" /> Ações
                <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${adminMenuOpen ? "rotate-180" : ""}`} />
              </Button>
              {adminMenuOpen && (
                <div
                  className="absolute left-0 top-full z-30 mt-1.5 min-w-[200px] rounded-xl border border-white/10 bg-[#0c1a14] shadow-xl backdrop-blur-md overflow-hidden"
                  onMouseLeave={() => setAdminMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => { setShowEditMatch(true); setAdminMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.06] transition-colors"
                  >
                    ✏️ Editar partida
                  </button>
                  {match.status === "COMPLETED" && (
                    <button
                      type="button"
                      onClick={() => { setShowEditPostGame(true); setAdminMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.06] transition-colors"
                    >
                      📊 Editar pós-jogo
                    </button>
                  )}
                  {match.status === "SCHEDULED" && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowConvocacao(true);
                        setConvocacaoText(buildConvocacaoText());
                        setAdminMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/[0.06] transition-colors"
                    >
                      📋 Gerar Convocação
                    </button>
                  )}
                  <div className="border-t border-white/[0.06]" />
                  {match.status === "SCHEDULED" && (
                    <button
                      type="button"
                      onClick={() => { setConfirmCancelOpen(true); setAdminMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#fca5a5] hover:bg-red-500/[0.08] transition-colors"
                    >
                      🚫 Cancelar partida
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setConfirmDeleteOpen(true); setAdminMenuOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#fca5a5] hover:bg-red-500/[0.08] transition-colors"
                  >
                    🗑️ Excluir partida
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Feedback / Alerts ──────────────────────────────── */}
      {copyMsg && (
        <div className="rounded-[12px] border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-3 text-sm text-[#6ee7b7] font-semibold">
          {copyMsg}
        </div>
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

      {/* ── Check-in Banner (Fácil Localização) ──────────────── */}
      {isScheduled && session?.user?.playerId && (() => {
        const loggedInPlayerRsvp = match.rsvps.find((r) => r.playerId === session?.user?.playerId);
        if (loggedInPlayerRsvp?.status !== "CONFIRMED" || match.isPlayerSuspended || !match.latitude || !match.longitude) {
          return null;
        }

        const matchTimeMs = new Date(match.date).getTime();
        const oneHourInMs = 1 * 60 * 60 * 1000;
        const formattedOpenTime = new Intl.DateTimeFormat("pt-BR", {
          timeStyle: "short",
          timeZone: "America/Sao_Paulo",
        }).format(new Date(matchTimeMs - oneHourInMs));

        return (
          <Card className="border-[rgba(16,185,129,0.2)] bg-gradient-to-br from-[#0c1a14] to-[#07130e] shadow-lg">
            <CardContent className="pt-6">
              {match.userAttendance?.present ? (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-400">Presença Confirmada no Local!</h3>
                      <p className="text-xs text-[var(--text-subtle)] mt-0.5">
                        Seu check-in foi registrado em{" "}
                        {match.userAttendance.checkedInAt
                          ? new Intl.DateTimeFormat("pt-BR", {
                              timeStyle: "short",
                              timeZone: "America/Sao_Paulo",
                            }).format(new Date(match.userAttendance.checkedInAt))
                          : ""}{" "}
                        h. Bom jogo!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Confirmação de Presença no Local</h3>
                      <p className="text-xs text-[var(--text-subtle)] mt-1 max-w-xl">
                        {isCheckInOpen 
                          ? "Você está confirmado para a partida! Por favor, realize o check-in no local clicando no botão ao lado para confirmar sua presença."
                          : `Você está confirmado para a partida! A confirmação de presença no local (check-in) será liberada a partir das ${formattedOpenTime}h (1 hora antes do início do jogo).`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto">
                    {isCheckInOpen ? (
                      <div className="flex flex-col gap-2 w-full">
                        {checkInFeedback && (
                          <p className="text-xs text-green-400 font-semibold">{checkInFeedback}</p>
                        )}
                        {checkInError && (
                          <p className="text-xs text-[#fca5a5] font-semibold max-w-xs">{checkInError}</p>
                        )}
                        <Button
                          onClick={handleCheckIn}
                          disabled={checkInLoading}
                          className="w-full sm:w-auto text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]"
                        >
                          {checkInLoading ? "Obtendo localização..." : "📍 Confirmar Presença (Check-in)"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        disabled
                        className="w-full sm:w-auto text-xs font-black uppercase tracking-wider text-white/40 bg-white/5 border border-white/10 cursor-not-allowed"
                      >
                        ⏳ Check-in Indisponível
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })()}

      {/* ── Tab Navigation Strip ──────────────────────────── */}
      {(isScheduled || canSeePostGame) && (
        <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
          <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5 backdrop-blur-sm min-w-max">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
              key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)] text-[#34d399] shadow-sm"
                      : "border border-transparent text-[#8fa39b] hover:text-white hover:bg-white/[0.04]"
                  }`}
                  title={section.helper}
                >
                  {sectionIcons[section.id]}
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeSection === "overview" && (
        <MatchOverviewTab
          match={match}
          confirmed={confirmed}
          pending={pending}
          declined={declined}
          isScheduled={isScheduled}
          isAdmin={isAdmin}
          isCoachOrAdmin={isCoachOrAdmin}
          getPregameRecapCardUrl={getPregameRecapCardUrl}
          handleCopyPregameRecapLink={handleCopyPregameRecapLink}
          buildConvocacaoText={buildConvocacaoText}
          trackPregameCtaClick={trackPregameCtaClick}
        />
      )}

      {activeSection === "presence" && (
        <MatchRsvpTab
          match={match}
          currentUserId={session?.user?.playerId ?? null}
          isCoachOrAdmin={isCoachOrAdmin}
          rsvpLoading={rsvpLoading}
          handleRsvp={handleRsvp}
          setMatch={setMatch}
          fetchMatch={fetchMatch}
          isCheckInOpen={isCheckInOpen}
          checkInFeedback={checkInFeedback}
          checkInError={checkInError}
          checkInLoading={checkInLoading}
          handleCheckIn={handleCheckIn}
        />
      )}

      {canSeeLineup && activeSection === "lineup" && (
        <MatchLineupTab
          match={match}
          lineupData={lineupData}
          lineupLoading={lineupLoading}
          lineupError={lineupError}
          lineupRefreshing={lineupRefreshing}
          lineupSaving={lineupSaving}
          fetchLineup={fetchLineup}
          handleSaveLineup={handleSaveLineup}
          handleResetSavedLineup={handleResetSavedLineup}
          buildLineupShareText={buildLineupShareText}
          showLineupShare={showLineupShare}
          setShowLineupShare={setShowLineupShare}
          lineupShareText={lineupShareText}
          setLineupShareText={setLineupShareText}
          setCopyMsg={setCopyMsg}
        />
      )}

      {activeSection === "gallery" && (
        <MatchGalleryTab matchId={match.id} opponent={match.opponent} />
      )}

      {canSeeLive && activeSection === "live" && (
        <MatchLiveTab matchId={match.id} />
      )}

      {(canSeeOperations || match.hasCharge) && activeSection === "operations" && (
        <MatchBordereauTab
          match={match}
          session={session}
          isAdmin={isAdmin}
          canSeeOperations={canSeeOperations}
          togglingPlayerId={togglingPlayerId}
          checklistLoading={checklistLoading}
          checklistPlayers={checklistPlayers}
          chargesFeedback={chargesFeedback}
          chargesError={chargesError}
          uploadingReceipt={uploadingReceipt}
          bordereauLoading={bordereauLoading}
          bordereauSaving={bordereauSaving}
          bordereauError={bordereauError}
          bordereauData={bordereauData}
          toggleChecklistItem={toggleChecklistItem}
          toggleAttendance={toggleAttendance}
          handleShirtNumberChange={handleShirtNumberChange}
          handleSaveBordereau={handleSaveBordereau}
          setExpenseModalOpen={setExpenseModalOpen}
          copyPixKey={copyPixKey}
          pixKeyCopied={pixKeyCopied}
          handleUploadReceipt={handleUploadReceipt}
          handleApproveReceipt={handleApproveReceipt}
          handleRejectReceipt={handleRejectReceipt}
          setPreviewReceipt={setPreviewReceipt}
          handleTogglePayment={handleTogglePayment}
        />
      )}

      {canSeePostGame && activeSection === "postgame" && (
        <MatchRatingTab
          match={match}
          session={session}
          isAdmin={isAdmin}
          showPostGame={showPostGame}
          setShowPostGame={setShowPostGame}
          fetchMatch={fetchMatch}
          votesLoading={votesLoading}
          votesData={votesData}
          votingForId={votingForId}
          setVotingForId={setVotingForId}
          submitVoteLoading={submitVoteLoading}
          voteError={voteError}
          handleCastVote={handleCastVote}
          ratingsLoading={ratingsLoading}
          userRatings={userRatings}
          ratingsAverages={ratingsAverages}
          canRate={canRate}
          submittingRatingId={submittingRatingId}
          handleRateTeammate={handleRateTeammate}
          getRecapCardUrl={getRecapCardUrl}
          handleCopyRecapLink={handleCopyRecapLink}
          handleCopyLink={handleCopyLink}
          buildResultText={buildResultText}
          trackRecapCtaClick={trackRecapCtaClick}
        />
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
            pixKey: match.pixKey,
            latitude: match.latitude,
            longitude: match.longitude,
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

      <Modal
        open={!!previewReceipt}
        onClose={() => setPreviewReceipt(null)}
        title={`Comprovante de ${previewReceipt?.playerName}`}
      >
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#090f0c] p-2 flex items-center justify-center min-h-[300px]">
            {previewReceipt?.url.toLowerCase().endsWith(".pdf") ? (
              <div className="text-center py-12 space-y-3">
                <FileText className="mx-auto h-12 w-12 text-white/40" />
                <p className="text-sm text-[var(--text-muted)]">Este comprovante é um documento PDF.</p>
                <a
                  href={previewReceipt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
                >
                  Abrir PDF em nova aba
                </a>
              </div>
            ) : (
              <img
                src={previewReceipt?.url}
                alt={`Comprovante de ${previewReceipt?.playerName}`}
                className="max-h-[500px] w-auto max-w-full rounded-lg object-contain shadow-lg"
              />
            )}
          </div>

          {isAdmin && previewReceipt && (
            <div className="flex gap-3 justify-end pt-2">
              <Button
                onClick={() => handleApproveReceipt(previewReceipt.playerId)}
                disabled={togglingPlayerId === previewReceipt.playerId}
                className="bg-[#10b981] hover:bg-[#059669] text-white flex items-center gap-1.5 font-bold"
              >
                <Check className="h-4 w-4" />
                Aprovar Pagamento
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleRejectReceipt(previewReceipt.playerId)}
                disabled={togglingPlayerId === previewReceipt.playerId}
                className="border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center gap-1.5 font-bold"
              >
                <XCircle className="h-4 w-4" />
                Recusar Comprovante
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPreviewReceipt(null)}
                className="font-bold"
              >
                Fechar
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
