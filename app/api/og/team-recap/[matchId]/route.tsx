import { ImageResponse } from "next/og";
import { buildTeamRecap } from "@/lib/team-recap";
import { safeHex } from "../../route-utils";
import { trackOperationalEvent } from "@/lib/telemetry";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ matchId: string }>;
}

type MatchResult = "VITORIA" | "DERROTA" | "EMPATE";

interface MatchdayRecapMatch {
  title: string;
  dateLabel: string;
  fieldLabel: "Mandante" | "Visitante";
  teamSide: "HOME" | "AWAY";
  status: {
    phase: "FINAL";
    result: MatchResult;
  };
  recent_form: {
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
  };
  goals: {
    home: number;
    away: number;
    team_for: number;
    team_against: number;
  };
  home: {
    name: string;
    badgeUrl: string | null;
  };
  away: {
    name: string;
    badgeUrl: string | null;
  };
  leaders: {
    topScorerLabel: string;
    topAssistantLabel: string;
  };
  totals: {
    goals: number;
    assists: number;
    playersWithStats: number;
  };
}

interface MatchdayRecapCardProps {
  match: MatchdayRecapMatch;
  primary: string;
  secondary: string;
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

function adaptiveFontSize(text: string, max: number, min: number) {
  if (text.length <= 12) return max;
  if (text.length >= 34) return min;

  const ratio = (text.length - 12) / (34 - 12);
  return Math.round(max - (max - min) * ratio);
}

function buildResultLabel(home: number, away: number) {
  if (home > away) return "VITORIA";
  if (home < away) return "DERROTA";
  return "EMPATE";
}

function fitTeamName(name: string) {
  return name.length > 24 ? `${name.slice(0, 23)}...` : name;
}

function MatchdayRecapCard({ match, primary, secondary }: MatchdayRecapCardProps) {
  const resultTone =
    match.status.result === "VITORIA"
      ? "rgba(16, 185, 129, 0.28)"
      : match.status.result === "DERROTA"
        ? "rgba(127, 29, 29, 0.56)"
        : "rgba(100, 116, 139, 0.38)";
  const resultShadow =
    match.status.result === "VITORIA"
      ? "0 0 20px rgba(16,185,129,0.22)"
      : match.status.result === "DERROTA"
        ? "0 0 22px rgba(239,68,68,0.28)"
        : "0 0 14px rgba(148,163,184,0.2)";

  const titleSize = adaptiveFontSize(match.title, 60, 36);
  const subtitleSize = adaptiveFontSize(`${match.away.name} ${match.dateLabel}`, 30, 21);
  const recentFormLabel =
    `${match.recent_form.wins}V ${match.recent_form.draws}E ${match.recent_form.losses}D | ` +
    `${match.recent_form.goals_for} GF ${match.recent_form.goals_against} GA`;
  const homeDisplayName = fitTeamName(match.home.name).toUpperCase();
  const awayDisplayName = fitTeamName(match.away.name).toUpperCase();

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        position: "relative",
        fontFamily: "Verdana, Arial, sans-serif",
        color: "white",
        background: `linear-gradient(130deg, ${primary} 0%, ${secondary} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0",
          display: "flex",
          background:
            "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.2), transparent 32%), radial-gradient(circle at 86% 0%, rgba(255,255,255,0.14), transparent 36%)",
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
          padding: "24px 26px",
          background: "rgba(3,8,24,0.44)",
          border: "1px solid rgba(255,255,255,0.18)",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "26px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flex: 1,
              minWidth: 0,
              maxWidth: 850,
            }}
          >
            <div style={{ display: "flex", fontSize: "17px", letterSpacing: "0.16em", opacity: 0.84 }}>
              MATCHDAY RECAP
            </div>
            <div
              style={{
                display: "flex",
                fontSize: `${titleSize}px`,
                fontWeight: 900,
                lineHeight: 1.02,
                whiteSpace: "normal",
              }}
            >
              {match.title}
            </div>
            <div style={{ display: "flex", fontSize: `${subtitleSize}px`, opacity: 0.92 }}>
              vs {fitTeamName(match.away.name)} | {match.dateLabel}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderRadius: "999px",
              background: resultTone,
              padding: "8px 14px",
              fontSize: "16px",
              justifyContent: "center",
              fontWeight: 700,
              minWidth: "220px",
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: resultShadow,
            }}
          >
            {match.status.phase} | {match.status.result}
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
          <div
            style={{
              display: "flex",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.14)",
              padding: "10px 14px",
              fontSize: "16px",
              minWidth: "210px",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            Campo: {match.fieldLabel}
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.14)",
              padding: "10px 16px",
              fontSize: "16px",
              flex: 1,
            }}
          >
            Forma recente: {recentFormLabel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderRadius: "30px",
            background: "rgba(255,255,255,0.10)",
            padding: "18px 24px 52px 24px",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid rgba(255,255,255,0.2)",
            minHeight: "346px",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "40%",
              minWidth: 0,
              borderRadius: "22px",
              padding: "8px 12px",
              background:
                match.status.result === "DERROTA" && match.teamSide === "HOME"
                  ? "linear-gradient(180deg, rgba(148,163,184,0.16) 0%, rgba(30,41,59,0.10) 100%)"
                  : "transparent",
            }}
          >
            <div style={{ display: "flex", fontSize: "13px", letterSpacing: "0.14em", opacity: 0.78 }}>CASA</div>
            <div
              style={{
                display: "flex",
                width: "154px",
                height: "154px",
                borderRadius: "50%",
                background: "rgba(2,6,23,0.3)",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.28)",
              }}
            >
              {match.home.badgeUrl ? (
                <img
                  src={match.home.badgeUrl}
                  alt={match.home.name}
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ display: "flex", fontSize: "22px", fontWeight: 800 }}>
                  {match.home.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "16px",
                opacity: 0.9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                maxWidth: "100%",
                textAlign: "center",
                justifyContent: "center",
                lineHeight: 1.15,
                minHeight: "54px",
                alignItems: "center",
              }}
            >
              {homeDisplayName}
            </div>
            <div
              style={{
                display: "flex",
                width: "180px",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "150px",
                lineHeight: 1,
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "Roboto Mono, Menlo, Consolas, monospace",
                marginTop: "auto",
                minHeight: "168px",
                textAlign: "center",
                textShadow: "0 10px 20px rgba(0,0,0,0.45)",
              }}
            >
              {match.goals.home}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(255,255,255,0.42)",
                fontSize: "30px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              X
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "40%",
              minWidth: 0,
              borderRadius: "22px",
              padding: "8px 12px",
              background:
                match.status.result === "DERROTA" && match.teamSide === "AWAY"
                  ? "linear-gradient(180deg, rgba(148,163,184,0.16) 0%, rgba(30,41,59,0.10) 100%)"
                  : "transparent",
            }}
          >
            <div style={{ display: "flex", fontSize: "13px", letterSpacing: "0.14em", opacity: 0.78 }}>VISITANTE</div>
            <div
              style={{
                display: "flex",
                width: "154px",
                height: "154px",
                borderRadius: "50%",
                background: "rgba(2,6,23,0.3)",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.28)",
              }}
            >
              {match.away.badgeUrl ? (
                <img
                  src={match.away.badgeUrl}
                  alt={match.away.name}
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ display: "flex", fontSize: "22px", fontWeight: 800 }}>
                  {match.away.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "16px",
                opacity: 0.9,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                maxWidth: "100%",
                textAlign: "center",
                justifyContent: "center",
                lineHeight: 1.15,
                minHeight: "54px",
                alignItems: "center",
              }}
            >
              {awayDisplayName}
            </div>
            <div
              style={{
                display: "flex",
                width: "180px",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "150px",
                lineHeight: 1,
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                fontFamily: "Roboto Mono, Menlo, Consolas, monospace",
                marginTop: "auto",
                minHeight: "168px",
                textAlign: "center",
                textShadow: "0 10px 20px rgba(0,0,0,0.45)",
              }}
            >
              {match.goals.away}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
              background: "rgba(2,6,23,0.28)",
              width: "50%",
              padding: "12px 16px",
            }}
          >
            <div style={{ display: "flex", fontSize: "14px", opacity: 0.84 }}>Artilheiro</div>
            <div style={{ display: "flex", fontSize: "30px", fontWeight: 700 }}>{cut(match.leaders.topScorerLabel, 34)}</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
              background: "rgba(2,6,23,0.28)",
              width: "50%",
              padding: "12px 16px",
            }}
          >
            <div style={{ display: "flex", fontSize: "14px", opacity: 0.84 }}>Lider em assistencias</div>
            <div style={{ display: "flex", fontSize: "30px", fontWeight: 700 }}>
              {cut(match.leaders.topAssistantLabel, 34)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {[
            { label: "Gols no jogo", value: match.totals.goals },
            { label: "Assistencias no jogo", value: match.totals.assists },
            { label: "Atletas com stats", value: match.totals.playersWithStats },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.12)",
                padding: "10px 12px",
                width: "33.33%",
              }}
            >
              <div style={{ display: "flex", fontSize: "14px", opacity: 0.84 }}>{item.label}</div>
              <div style={{ display: "flex", fontSize: "28px", fontWeight: 800 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function GET(request: Request, context: RouteContext) {
  const { matchId } = await context.params;

  try {
    const recap = await buildTeamRecap(matchId);

    if (!recap) {
      return new Response("Not found", { status: 404 });
    }

    const primary = safeHex(recap.team.primaryColor, "#1d7a61");
    const secondary = safeHex(recap.team.secondaryColor, "#0f172a");
    const teamGoals = recap.match.isHome ? recap.match.homeScore : recap.match.awayScore;
    const opponentGoals = recap.match.isHome ? recap.match.awayScore : recap.match.homeScore;
    const resultLabel = buildResultLabel(teamGoals, opponentGoals);
    const dateLabel = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
    }).format(recap.match.date);

    const topScorerLabel = recap.leaders.topScorer
      ? `${recap.leaders.topScorer.playerName} (${recap.leaders.topScorer.goals})`
      : "Sem artilheiro no jogo";
    const topAssistantLabel = recap.leaders.topAssistant
      ? `${recap.leaders.topAssistant.playerName} (${recap.leaders.topAssistant.assists})`
      : "Sem lider de assistencias";

    trackOperationalEvent("recap_team_card_viewed", {
      matchId,
      teamId: recap.team.id,
      homeScore: recap.match.homeScore,
      awayScore: recap.match.awayScore,
    });

    const teamBadgeUrl = resolveAssetUrl(recap.team.badgeUrl, request.url);
    const opponentBadgeUrl = resolveAssetUrl(recap.match.opponentBadgeUrl, request.url);
    const teamLabel = recap.team.shortName || recap.team.name;
    const opponentLabel = recap.match.opponent;
    const homeName = recap.match.isHome ? teamLabel : opponentLabel;
    const awayName = recap.match.isHome ? opponentLabel : teamLabel;
    const homeBadge = recap.match.isHome ? teamBadgeUrl : opponentBadgeUrl;
    const awayBadge = recap.match.isHome ? opponentBadgeUrl : teamBadgeUrl;
    const matchViewModel: MatchdayRecapMatch = {
      title: teamLabel,
      dateLabel,
      fieldLabel: recap.match.isHome ? "Mandante" : "Visitante",
      teamSide: recap.match.isHome ? "HOME" : "AWAY",
      status: {
        phase: "FINAL",
        result: resultLabel,
      },
      recent_form: {
        wins: recap.recentForm.wins,
        draws: recap.recentForm.draws,
        losses: recap.recentForm.losses,
        goals_for: recap.recentForm.goalsFor,
        goals_against: recap.recentForm.goalsAgainst,
      },
      goals: {
        home: recap.match.homeScore,
        away: recap.match.awayScore,
        team_for: teamGoals,
        team_against: opponentGoals,
      },
      home: {
        name: homeName,
        badgeUrl: homeBadge,
      },
      away: {
        name: awayName,
        badgeUrl: awayBadge,
      },
      leaders: {
        topScorerLabel,
        topAssistantLabel,
      },
      totals: {
        goals: recap.totals.goals,
        assists: recap.totals.assists,
        playersWithStats: recap.totals.playersWithStats,
      },
    };

    return new ImageResponse(
      <MatchdayRecapCard match={matchViewModel} primary={primary} secondary={secondary} />,
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    trackOperationalEvent("recap_team_card_failed", {
      matchId,
      message,
    });

    const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <text x="600" y="290" fill="#e2e8f0" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700">
    Matchday Recap
  </text>
  <text x="600" y="345" fill="#94a3b8" text-anchor="middle" font-family="Arial, sans-serif" font-size="30">
    Recap indisponivel no momento
  </text>
</svg>`;

    return new Response(fallbackSvg.trim(), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  }
}
