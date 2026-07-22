import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LiveScoreboard } from "@/components/matches/LiveScoreboard";

interface MatchLivePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MatchLivePage({ params }: MatchLivePageProps) {
  const { id: matchId } = await params;

  // Fetch inicial dos dados da partida no banco de dados via Prisma
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          badgeUrl: true,
        },
      },
      matchLive: {
        include: {
          events: {
            include: {
              player: {
                select: {
                  id: true,
                  name: true,
                  shirtNumber: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
      rsvps: {
        include: {
          player: {
            select: {
              id: true,
              name: true,
              shirtNumber: true,
            },
          },
        },
      },
    },
  });

  if (!match) {
    notFound();
  }

  // Buscar todos os jogadores do time para a seleção no formulário de eventos
  const players = await prisma.player.findMany({
    where: { teamId: match.teamId, status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      shirtNumber: true,
    },
    orderBy: {
      shirtNumber: "asc",
    },
  });

  // Garante a existência do registro MatchLive caso ainda não tenha sido criado
  let matchLive = match.matchLive;

  if (!matchLive) {
    matchLive = await prisma.matchLive.create({
      where: { matchId: match.id },
      data: {
        matchId: match.id,
        liveStatus: "NOT_STARTED",
        homeScore: match.homeScore || 0,
        awayScore: match.awayScore || 0,
      },
      include: {
        events: {
          include: {
            player: {
              select: {
                id: true,
                name: true,
                shirtNumber: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    } as any);
  }

  // Formata os eventos iniciais
  const formattedEvents =
    matchLive?.events.map((evt) => ({
      id: evt.id,
      type: evt.type as any,
      minute: evt.minute,
      half: evt.half,
      description: evt.description,
      player: evt.player
        ? {
            id: evt.player.id,
            name: evt.player.name,
            shirtNumber: evt.player.shirtNumber,
          }
        : null,
    })) || [];

  // Formata os RSVPs iniciais
  const formattedRsvps = match.rsvps.map((r) => ({
    id: r.id,
    playerId: r.playerId,
    status: r.status as any,
    player: {
      id: r.player.id,
      name: r.player.name,
      shirtNumber: r.player.shirtNumber,
    },
  }));

  return (
    <LiveScoreboard
      matchId={match.id}
      teamName={match.team.name}
      opponentName={match.opponent}
      venue={match.venue}
      matchDate={match.date.toISOString()}
      isHome={match.isHome}
      initialHomeScore={matchLive?.homeScore || 0}
      initialAwayScore={matchLive?.awayScore || 0}
      initialLiveStatus={matchLive?.liveStatus || "NOT_STARTED"}
      matchLiveId={matchLive?.id || ""}
      initialEvents={formattedEvents}
      initialRsvps={formattedRsvps}
      playersList={players}
      // Se necessário, pode passar a sessão atual do usuário/jogador logado
    />
  );
}
