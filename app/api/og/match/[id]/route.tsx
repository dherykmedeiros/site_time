import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { safeHex } from "../../route-utils";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function resolveAssetUrl(path: string | null | undefined, requestUrl: string) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const origin =
    (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "") ||
    new URL(requestUrl).origin;

  if (!path.startsWith("/")) {
    return `${origin}/${path}`;
  }

  return `${origin}${path}`;
}

function cut(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      team: {
        select: {
          name: true,
          shortName: true,
          primaryColor: true,
          secondaryColor: true,
          badgeUrl: true,
        },
      },
      matchStats: {
        where: { goals: { gt: 0 } },
        include: { player: { select: { name: true } } },
        orderBy: { goals: "desc" },
        take: 3,
      },
    },
  });

  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  const primaryColor = safeHex(match.team.primaryColor, "#1e40af");
  const secondaryColor = safeHex(match.team.secondaryColor, "#0f172a");
  const teamBadgeUrl = resolveAssetUrl(match.team.badgeUrl, request.url);
  const opponentBadgeUrl = resolveAssetUrl(match.opponentBadgeUrl, request.url);
  const teamLabel = match.team.shortName || cut(match.team.name, 16);
  const opponentLabel = cut(match.opponent, 16);
  const homeName = match.isHome ? teamLabel : opponentLabel;
  const awayName = match.isHome ? opponentLabel : teamLabel;
  const homeBadge = match.isHome ? teamBadgeUrl : opponentBadgeUrl;
  const awayBadge = match.isHome ? opponentBadgeUrl : teamBadgeUrl;
  const isCompleted =
    match.status === "COMPLETED" &&
    match.homeScore !== null &&
    match.awayScore !== null;

  const home = match.homeScore ?? "-";
  const away = match.awayScore ?? "-";

  const resultLabel =
    typeof home === "number" && typeof away === "number"
      ? home > away
        ? "VITORIA"
        : home < away
          ? "DERROTA"
          : "EMPATE"
      : "PRE-JOGO";
  const resultBg =
    resultLabel === "VITORIA"
      ? "rgba(16,185,129,0.3)"
      : resultLabel === "DERROTA"
        ? "rgba(239,68,68,0.3)"
        : resultLabel === "EMPATE"
          ? "rgba(234,179,8,0.3)"
          : "rgba(59,130,246,0.28)";

  const scorers = match.matchStats
    .map((s) => `${s.player.name} (${s.goals})`)
    .join("  ·  ");

  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(match.date);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: `linear-gradient(132deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          position: "relative",
          color: "white",
          fontFamily: "Verdana, Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0",
            display: "flex",
            background:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.2), transparent 34%), radial-gradient(circle at 82% 0%, rgba(255,255,255,0.14), transparent 36%)",
          }}
        />

        <div
          style={{
            margin: "36px",
            borderRadius: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "calc(100% - 72px)",
            height: "calc(100% - 72px)",
            padding: "36px 38px",
            background: "rgba(0,0,0,0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "74%" }}>
              <div style={{ display: "flex", fontSize: "18px", letterSpacing: "0.16em", opacity: 0.84 }}>
                {isCompleted ? "MATCHDAY FINAL" : "MATCHDAY PREVIEW"}
              </div>
              <div style={{ display: "flex", fontSize: "63px", fontWeight: 900, lineHeight: 1.02 }}>
                  {teamLabel}
              </div>
              <div style={{ display: "flex", fontSize: "30px", opacity: 0.92 }}>
                vs {cut(match.opponent, 30)} | {dateStr}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                borderRadius: "999px",
                background: resultBg,
                padding: "10px 18px",
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.08em",
              }}
            >
              {resultLabel}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderRadius: "28px",
              background: "rgba(255,255,255,0.14)",
              padding: "30px 28px",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "280px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "260px", gap: "10px" }}>
              <div style={{ display: "flex", fontSize: "14px", letterSpacing: "0.12em", opacity: 0.72 }}>CASA</div>
              <div
                style={{
                  display: "flex",
                  width: "88px",
                  height: "88px",
                  borderRadius: "22px",
                  background: "rgba(255,255,255,0.16)",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {homeBadge ? (
                  <img
                    src={homeBadge}
                    alt={homeName}
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", fontSize: "30px", fontWeight: 800 }}>
                    {homeName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", fontSize: "20px", opacity: 0.86 }}>{homeName}</div>
              <div style={{ display: "flex", fontSize: "106px", fontWeight: 900 }}>{home}</div>
            </div>

            <div style={{ display: "flex", fontSize: "44px", fontWeight: 800, opacity: 0.86 }}>x</div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "260px", gap: "10px" }}>
              <div style={{ display: "flex", fontSize: "14px", letterSpacing: "0.12em", opacity: 0.72 }}>VISITANTE</div>
              <div
                style={{
                  display: "flex",
                  width: "88px",
                  height: "88px",
                  borderRadius: "22px",
                  background: "rgba(255,255,255,0.16)",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {awayBadge ? (
                  <img
                    src={awayBadge}
                    alt={awayName}
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", fontSize: "30px", fontWeight: 800 }}>
                    {awayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", fontSize: "20px", opacity: 0.86 }}>{awayName}</div>
              <div style={{ display: "flex", fontSize: "106px", fontWeight: 900 }}>{away}</div>
            </div>
          </div>

          {isCompleted ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", fontSize: "16px", opacity: 0.72 }}>
                {scorers.length > 0 ? `Goleadores: ${cut(scorers, 80)}` : "Sem gols registrados na sumula"}
              </div>
              <div style={{ display: "flex", fontSize: "14px", opacity: 0.56, letterSpacing: "0.06em" }}>VARzea</div>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: "16px", opacity: 0.74 }}>
              Compartilhe este card para convocar e engajar o elenco antes da partida.
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
