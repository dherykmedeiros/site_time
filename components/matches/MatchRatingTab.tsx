"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Star, Trophy, Eye, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { TeamRecapWidget } from "@/components/dashboard/TeamRecapWidget";
import type { MatchDetail, PlayerStat } from "@/app/dashboard/matches/[id]/page";

const PostGameForm = dynamic(
  () => import("@/components/forms/PostGameForm").then((m) => m.PostGameForm),
  { loading: () => <div className="p-4 text-center text-gray-500">Carregando formulário...</div> }
);

interface TeammateRatingRowProps {
  player: PlayerStat;
  currentUserPlayerId: string | null;
  userRating: number | null;
  averageRating: number;
  totalRatings: number;
  canRate: boolean;
  onRate: (stars: number) => void;
  isSubmitting: boolean;
}

function TeammateRatingRow({
  player,
  currentUserPlayerId,
  userRating,
  averageRating,
  totalRatings,
  canRate,
  onRate,
  isSubmitting,
}: TeammateRatingRowProps) {
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

interface MatchRatingTabProps {
  match: MatchDetail;
  session: any;
  isAdmin: boolean;
  showPostGame: boolean;
  setShowPostGame: (show: boolean) => void;
  fetchMatch: () => void;
  votesLoading: boolean;
  votesData: any;
  votingForId: string;
  setVotingForId: (id: string) => void;
  submitVoteLoading: boolean;
  voteError: string | null;
  handleCastVote: () => void;
  ratingsLoading: boolean;
  userRatings: any[];
  ratingsAverages: any[];
  canRate: boolean;
  submittingRatingId: string | null;
  handleRateTeammate: (playerId: string, stars: number) => void;
  getRecapCardUrl: () => string;
  handleCopyRecapLink: () => void;
  handleCopyLink: () => void;
  buildResultText: () => string;
  trackRecapCtaClick: (cta: "open_card" | "copy_link" | "whatsapp_share") => void;
}

export function MatchRatingTab({
  match,
  session,
  isAdmin,
  showPostGame,
  setShowPostGame,
  fetchMatch,
  votesLoading,
  votesData,
  votingForId,
  setVotingForId,
  submitVoteLoading,
  voteError,
  handleCastVote,
  ratingsLoading,
  userRatings,
  ratingsAverages,
  canRate,
  submittingRatingId,
  handleRateTeammate,
  getRecapCardUrl,
  handleCopyRecapLink,
  handleCopyLink,
  buildResultText,
  trackRecapCtaClick,
}: MatchRatingTabProps) {
  const currentUserId = session?.user?.playerId;

  return (
    <div className="space-y-6">
      {/* Post-game form (T042) — show when canSubmitPostGame is true */}
      {isAdmin && match.canSubmitPostGame && !showPostGame && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold text-orange-400">Pós-jogo disponível</p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  A data da partida já passou. Registre o placar e as estatísticas.
                </p>
              </div>
              <Button onClick={() => setShowPostGame(true)}>
                Registrar Pós-Jogo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isAdmin && match.canSubmitPostGame && showPostGame && (
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

      {/* Stats display */}
      {match.status === "COMPLETED" && match.stats.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Estatísticas Individuais</h2>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 pb-2 text-[var(--text-muted)]">
                    <th className="pb-2 font-medium">Jogador</th>
                    <th className="pb-2 text-center font-medium">Gols</th>
                    <th className="pb-2 text-center font-medium">Assist.</th>
                    <th className="pb-2 text-center font-medium">🟨</th>
                    <th className="pb-2 text-center font-medium">🟥</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {match.stats.map((stat) => (
                    <tr key={stat.playerId} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 font-medium">{stat.playerName}</td>
                      <td className="py-2.5 text-center">{stat.goals}</td>
                      <td className="py-2.5 text-center">{stat.assists}</td>
                      <td className="py-2.5 text-center">{stat.yellowCards}</td>
                      <td className="py-2.5 text-center">{stat.redCards}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player of the Match Voting Card */}
      {match.status === "COMPLETED" && (
        <Card className="rounded-[22px] border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <span className="text-[#34d399]">🏆</span> Craque da Partida
            </h2>
            <p className="text-xs text-[#8fa39b] mt-1">
              Vote no melhor jogador em campo nesta partida. Apenas atletas que participaram podem votar.
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {votesLoading ? (
              <div className="space-y-3 py-4">
                <div className="h-16 animate-pulse rounded-xl border border-white/5 bg-white/[0.01]" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Voting Action */}
                {currentUserId && match.userAttendance?.present ? (
                  votesData?.hasVoted ? (
                    <div className="rounded-xl border border-green-500/10 bg-green-500/5 p-4 flex items-center gap-3">
                      <span className="text-xl">✅</span>
                      <div>
                        <p className="text-sm font-semibold text-white">Seu voto foi registrado!</p>
                        <p className="text-xs text-[#8fa39b] mt-0.5">
                          Você votou em: <strong className="text-[#34d399]">{votesData.results.find((r: any) => r.playerId === votesData.votedForId)?.playerName || "atleta"}</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3">
                      <p className="text-sm font-semibold text-white">Deixe seu voto para o Craque do Jogo:</p>
                      {voteError && <p className="text-xs text-red-400 font-semibold">{voteError}</p>}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <select
                          aria-label="Escolher jogador"
                          value={votingForId}
                          onChange={(e) => setVotingForId(e.target.value)}
                          className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-[var(--brand)] focus:outline-none"
                        >
                          <option value="">-- Selecione o Craque --</option>
                          {match.stats
                            .filter((s) => s.playerId && !s.guestPlayerId && s.playerId !== currentUserId)
                            .map((s) => (
                              <option key={s.playerId} value={s.playerId || ""}>
                                {s.playerName}
                              </option>
                            ))}
                        </select>
                        <Button
                          onClick={handleCastVote}
                          disabled={!votingForId || submitVoteLoading}
                          className="text-xs font-black uppercase tracking-wider text-[#010403] bg-[#10b981] hover:bg-[#34d399]"
                        >
                          {submitVoteLoading ? "Enviando..." : "Confirmar Voto"}
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-4 text-center">
                    <p className="text-sm font-semibold text-white/80">Votação Restrita</p>
                    <p className="text-xs text-[#8fa39b] mt-1">
                      Apenas jogadores com presença física confirmada (check-in) nesta partida podem votar.
                    </p>
                  </div>
                )}

                {/* Leaderboard Results */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#8fa39b] border-b border-white/5 pb-2">
                    Resultados Parciais
                  </h3>
                  {votesData?.results && votesData.results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {votesData.results.map((res: any, index: number) => (
                        <div
                          key={res.playerId}
                          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-white/40">#{index + 1}</span>
                            <div>
                              <p className="text-sm font-semibold text-white">{res.playerName}</p>
                              <p className="text-[10px] text-[#8fa39b]">
                                {res.shirtNumber ? `#${res.shirtNumber}` : "Sem número"} • {res.position}
                              </p>
                            </div>
                          </div>
                          <span className="rounded-full bg-[#10b981]/15 border border-[#10b981]/20 px-3 py-1 text-xs font-bold text-[#10b981]">
                            {res.voteCount} {res.voteCount === 1 ? "voto" : "votos"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#8fa39b] italic">Nenhum voto registrado para esta partida ainda.</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Teammate Ratings Card */}
      {match.status === "COMPLETED" && match.stats.length > 0 && (
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
                      currentUserPlayerId={currentUserId}
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

      {/* Recap Card */}
      {match.status === "COMPLETED" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recap da Rodada</h2>
          </CardHeader>
          <CardContent>
            <TeamRecapWidget matchId={match.id} />
          </CardContent>
        </Card>
      )}

      {match.status === "COMPLETED" &&
        match.stats.length > 0 &&
        match.homeScore !== null &&
        match.awayScore !== null && (
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-blue-400">Compartilhar resultado</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
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
                      window.open(recapUrl, "_blank", "noopener,noreferrer");
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
    </div>
  );
}
