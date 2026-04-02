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
  const teamGoals = match.isHome ? match.homeScore : match.awayScore;
  const opponentGoals = match.isHome ? match.awayScore : match.homeScore;

  const resultLabel =
    typeof teamGoals === "number" && typeof opponentGoals === "number"
      ? teamGoals > opponentGoals
        ? "VITORIA"
        : teamGoals < opponentGoals
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
    timeStyle: "short",
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
            margin: "30px",
            borderRadius: "32px",
            display: "flex",
            flexDirection: "column",
            width: 1140,
            height: 570,
            padding: "26px 28px",
            background: "rgba(2,6,23,0.42)",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "72%" }}>
              <div style={{ display: "flex", fontSize: "16px", letterSpacing: "0.16em", opacity: 0.82 }}>
                {isCompleted ? "MATCHDAY RESULT" : "MATCHDAY PREVIEW"}
              </div>
              <div style={{ display: "flex", fontSize: "56px", fontWeight: 900, lineHeight: 1.02 }}>
                {teamLabel}
              </div>
              <div style={{ display: "flex", fontSize: "28px", opacity: 0.94 }}>
                vs {cut(match.opponent, 26)}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                borderRadius: "999px",
                background: resultBg,
                padding: "10px 18px",
                fontSize: "17px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                minWidth: "220px",
                justifyContent: "center",
              }}
            >
              {isCompleted ? `FINAL | ${resultLabel}` : "PRE-JOGO"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderRadius: "30px",
              background: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.10) 100%)",
              padding: "20px 24px",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              minHeight: "320px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "290px", gap: "8px" }}>
              <div style={{ display: "flex", fontSize: "13px", letterSpacing: "0.14em", opacity: 0.78 }}>CASA</div>
              <div
                style={{
                  display: "flex",
                  width: "162px",
                  height: "162px",
                  borderRadius: "50%",
                  background: "rgba(2,6,23,0.38)",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "3px solid rgba(255,255,255,0.26)",
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
                  <div style={{ display: "flex", fontSize: "52px", fontWeight: 900 }}>
                    {homeName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", fontSize: "24px", fontWeight: 700 }}>{homeName}</div>
              <div style={{ display: "flex", fontSize: "152px", lineHeight: 0.9, fontWeight: 900 }}>
                {home}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(2,6,23,0.34)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: "44px",
                fontWeight: 900,
                opacity: 0.9,
              }}
            >
              X
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "290px", gap: "8px" }}>
              <div style={{ display: "flex", fontSize: "13px", letterSpacing: "0.14em", opacity: 0.78 }}>VISITANTE</div>
              <div
                style={{
                  display: "flex",
                  width: "162px",
                  height: "162px",
                  borderRadius: "50%",
                  background: "rgba(2,6,23,0.38)",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  border: "3px solid rgba(255,255,255,0.26)",
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
                  <div style={{ display: "flex", fontSize: "52px", fontWeight: 900 }}>
                    {awayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", fontSize: "24px", fontWeight: 700 }}>{awayName}</div>
              <div style={{ display: "flex", fontSize: "152px", lineHeight: 0.9, fontWeight: 900 }}>
                {away}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.14)",
                padding: "10px 14px",
                fontSize: "16px",
              }}
            >
              Local: {cut(match.venue, 34)}
            </div>
            <div
              style={{
                display: "flex",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.14)",
                padding: "10px 14px",
                fontSize: "16px",
              }}
            >
              Data e hora: {dateStr}
            </div>
            <div
              style={{
                display: "flex",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.14)",
                padding: "10px 14px",
                fontSize: "16px",
              }}
            >
              Campo: {match.isHome ? "Mandante" : "Visitante"}
            </div>
          </div>

          {isCompleted && (
            <div style={{ display: "flex", fontSize: "15px", opacity: 0.74 }}>
              {scorers.length > 0 ? `Goleadores: ${cut(scorers, 96)}` : "Sem gols registrados na sumula"}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
