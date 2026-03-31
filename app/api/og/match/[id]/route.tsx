import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Validate and sanitize a CSS hex color to prevent injection */
function safeHex(color: string | null | undefined, fallback: string): string {
  if (!color) return fallback;
  return /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : fallback;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      team: {
        select: {
          name: true,
          primaryColor: true,
          secondaryColor: true,
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

  if (
    !match ||
    match.status !== "COMPLETED" ||
    match.homeScore === null ||
    match.awayScore === null
  ) {
    return new Response("Not found", { status: 404 });
  }

  const primaryColor = safeHex(match.team.primaryColor, "#1e40af");
  const home = match.homeScore;
  const away = match.awayScore;

  const resultLabel = home > away ? "VITÓRIA" : home < away ? "DERROTA" : "EMPATE";
  const resultBg = home > away ? "#34d399" : home < away ? "#f87171" : "#fbbf24";
  const resultText = home > away ? "#052e16" : home < away ? "#450a0a" : "#451a03";

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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${primaryColor} 0%, #0f172a 100%)`,
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        {/* Team name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "36px",
          }}
        >
          <span style={{ fontSize: "28px" }}>⚽</span>
          <span
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: "20px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {match.team.name}
          </span>
        </div>

        {/* Score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          <span
            style={{
              fontSize: "136px",
              fontWeight: "900",
              color: "white",
              lineHeight: 1,
            }}
          >
            {home}
          </span>
          <span
            style={{
              fontSize: "64px",
              color: "rgba(255,255,255,0.45)",
              fontWeight: "300",
            }}
          >
            ×
          </span>
          <span
            style={{
              fontSize: "136px",
              fontWeight: "900",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1,
            }}
          >
            {away}
          </span>
        </div>

        {/* Opponent & date */}
        <div
          style={{
            color: "rgba(255,255,255,0.58)",
            fontSize: "22px",
            marginTop: "12px",
          }}
        >
          vs {match.opponent} · {dateStr}
        </div>

        {/* Result badge */}
        <div
          style={{
            marginTop: "28px",
            backgroundColor: resultBg,
            color: resultText,
            fontSize: "18px",
            fontWeight: "800",
            letterSpacing: "0.12em",
            padding: "10px 28px",
            borderRadius: "100px",
          }}
        >
          {resultLabel}
        </div>

        {/* Scorers */}
        {scorers.length > 0 && (
          <div
            style={{
              marginTop: "18px",
              color: "rgba(255,255,255,0.55)",
              fontSize: "16px",
            }}
          >
            ⚽ {scorers}
          </div>
        )}

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "22px",
            right: "28px",
            color: "rgba(255,255,255,0.28)",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "0.06em",
          }}
        >
          Site Time
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
