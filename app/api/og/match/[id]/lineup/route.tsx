import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { buildMatchLineupSnapshot } from "@/lib/match-lineup";
import { buildLineupFieldPlacements } from "@/lib/lineup-field";
import { safeHex } from "../../../route-utils";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const match = await prisma.match.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      opponent: true,
      status: true,
      lineupFormation: true,
      team: {
        select: {
          name: true,
          primaryColor: true,
          secondaryColor: true,
        },
      },
      positionLimits: {
        select: {
          position: true,
          maxPlayers: true,
        },
      },
      rsvps: {
        select: {
          status: true,
          player: {
            select: {
              id: true,
              name: true,
              position: true,
              shirtNumber: true,
              status: true,
              createdAt: true,
            },
          },
        },
      },
      lineupSelections: {
        orderBy: [{ role: "asc" }, { sortOrder: "asc" }],
        select: {
          role: true,
          sortOrder: true,
          fieldX: true,
          fieldY: true,
          updatedAt: true,
          player: {
            select: {
              id: true,
              name: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!match || match.status !== "SCHEDULED") {
    return new Response("Not found", { status: 404 });
  }

  const snapshot = buildMatchLineupSnapshot({
    matchId: match.id,
    confirmedPlayers: match.rsvps.map((rsvp) => ({
      playerId: rsvp.player.id,
      playerName: rsvp.player.name,
      position: rsvp.player.position,
      shirtNumber: rsvp.player.shirtNumber,
      createdAt: rsvp.player.createdAt,
      status: rsvp.player.status,
      rsvpStatus: rsvp.status,
    })),
    positionLimits: match.positionLimits.map((limit) => ({
      position: limit.position,
      maxPlayers: limit.maxPlayers,
    })),
    savedSelections: match.lineupSelections.map((selection) => ({
      role: selection.role,
      sortOrder: selection.sortOrder,
      fieldX: selection.fieldX,
      fieldY: selection.fieldY,
      updatedAt: selection.updatedAt,
      player: selection.player,
    })),
    savedFormation: match.lineupFormation,
  });

  const placements = buildLineupFieldPlacements(snapshot.lineup.starters);
  const primaryColor = safeHex(match.team.primaryColor, "#1d7a61");
  const secondaryColor = safeHex(match.team.secondaryColor, "#0f172a");
  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(match.date);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#081512",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "370px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px 34px",
            background: `linear-gradient(180deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ fontSize: "18px", letterSpacing: "0.16em", opacity: 0.72 }}>ESCALACAO</div>
            <div style={{ fontSize: "42px", fontWeight: 900, lineHeight: 1.1 }}>{match.team.name}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, opacity: 0.92 }}>vs {match.opponent}</div>
            <div style={{ fontSize: "18px", opacity: 0.72 }}>{dateStr}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                alignSelf: "flex-start",
                background: "rgba(255,255,255,0.12)",
                borderRadius: "999px",
                padding: "8px 14px",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {snapshot.lineup.meta.source === "SAVED" ? "Escalacao manual salva" : "Escalacao sugerida"}
            </div>
            <div style={{ fontSize: "16px", opacity: 0.82 }}>
              Titulares: {snapshot.lineup.meta.startersCount} · Banco: {snapshot.lineup.meta.benchCount}
            </div>
            {snapshot.lineup.alerts.slice(0, 2).map((alert) => (
              <div
                key={alert}
                style={{
                  fontSize: "14px",
                  lineHeight: 1.35,
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                {alert}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at center, rgba(44,145,98,0.28) 0%, rgba(14,54,38,0.2) 38%, rgba(4,19,14,1) 100%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "36px",
              borderRadius: "30px",
              border: "4px solid rgba(255,255,255,0.8)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "72px",
              bottom: "72px",
              width: "4px",
              background: "rgba(255,255,255,0.75)",
              transform: "translateX(-50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              border: "4px solid rgba(255,255,255,0.75)",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "36px",
              top: "145px",
              width: "125px",
              height: "340px",
              borderTop: "4px solid rgba(255,255,255,0.75)",
              borderRight: "4px solid rgba(255,255,255,0.75)",
              borderBottom: "4px solid rgba(255,255,255,0.75)",
              borderLeft: "none",
              borderTopRightRadius: "28px",
              borderBottomRightRadius: "28px",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "36px",
              top: "225px",
              width: "42px",
              height: "180px",
              borderTop: "4px solid rgba(255,255,255,0.75)",
              borderRight: "4px solid rgba(255,255,255,0.75)",
              borderBottom: "4px solid rgba(255,255,255,0.75)",
              borderLeft: "none",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "36px",
              top: "145px",
              width: "125px",
              height: "340px",
              borderTop: "4px solid rgba(255,255,255,0.75)",
              borderLeft: "4px solid rgba(255,255,255,0.75)",
              borderBottom: "4px solid rgba(255,255,255,0.75)",
              borderRight: "none",
              borderTopLeftRadius: "28px",
              borderBottomLeftRadius: "28px",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "36px",
              top: "225px",
              width: "42px",
              height: "180px",
              borderTop: "4px solid rgba(255,255,255,0.75)",
              borderLeft: "4px solid rgba(255,255,255,0.75)",
              borderBottom: "4px solid rgba(255,255,255,0.75)",
              borderRight: "none",
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "139px",
              top: "50%",
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.8)",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "139px",
              top: "50%",
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.8)",
              transform: "translate(50%, -50%)",
            }}
          />

          {placements.map((placement) => (
            <div
              key={placement.playerId}
              style={{
                position: "absolute",
                left: `${placement.y}%`,
                top: `${placement.x}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                width: "130px",
              }}
            >
              <div
                style={{
                  width: "62px",
                  height: "62px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: primaryColor,
                  color: "white",
                  fontSize: "18px",
                  fontWeight: 900,
                  border: "4px solid rgba(255,255,255,0.85)",
                  boxShadow: "0 16px 26px rgba(0,0,0,0.28)",
                }}
              >
                {placement.shortLabel}
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                {placement.playerName}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}