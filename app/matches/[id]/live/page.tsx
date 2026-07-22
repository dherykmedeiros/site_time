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
  let matchLiveId = match.matchLive?.id || "";
  let homeScore = match.matchLive?.homeScore ?? match.homeScore ?? 0;
  let awayScore = match.matchLive?.awayScore ?? match.awayScore ?? 0;
  let liveStatus: string = match.matchLive?.liveStatus || "NOT_STARTED";
  let rawEvents = match.matchLive?.events || [];

  if (!match.matchLive) {
    const createdLive = await prisma.matchLive.create({
      data: {
        matchId: match.id,
        liveStatus: "NOT_STARTED",
        homeScore: match.homeScore || 0,
        awayScore: match.awayScore || 0,
      },
    });

    matchLiveId = createdLive.id;
    homeScore = createdLive.homeScore;
    awayScore = createdLive.awayScore;
    liveStatus = createdLive.liveStatus;
    rawEvents = [];
  }

  // Formata os eventos iniciais
  const formattedEvents = rawEvents.map((evt) => ({
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
  }));

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
      initialHomeScore={homeScore}
      initialAwayScore={awayScore}
      initialLiveStatus={liveStatus}
      matchLiveId={matchLiveId}
      initialEvents={formattedEvents}
      initialRsvps={formattedRsvps}
      playersList={players}
    />
  );
}
