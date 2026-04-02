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

function MatchdayRecapCard({ match, primary, secondary }: MatchdayRecapCardProps) {
  const resultTone =
    match.status.result === "VITORIA"
      ? "rgba(16, 185, 129, 0.34)"
      : match.status.result === "DERROTA"
        ? "rgba(127, 29, 29, 0.50)"
        : "rgba(100, 116, 139, 0.40)";

  const titleSize = adaptiveFontSize(match.title, 60, 36);
  const subtitleSize = adaptiveFontSize(`${match.away.name} ${match.dateLabel}`, 30, 21);
  const homeNameSize = adaptiveFontSize(match.home.name, 40, 24);
  const awayNameSize = adaptiveFontSize(match.away.name, 40, 24);
  const recentFormLabel =
    `${match.recent_form.wins}V ${match.recent_form.draws}E ${match.recent_form.losses}D | ` +
    `${match.recent_form.goals_for} GF ${match.recent_form.goals_against} GA`;

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
          width: "calc(100% - 60px)",
          height: "calc(100% - 60px)",
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
              maxWidth: "calc(100% - 290px)",
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
              vs {match.away.name} | {match.dateLabel}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderRadius: "999px",
              background: resultTone,
              padding: "10px 18px",
              fontSize: "18px",
              justifyContent: "center",
              fontWeight: 700,
              minWidth: "250px",
              flexShrink: 0,
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
            background: "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.10) 100%)",
            padding: "18px 24px",
            justifyContent: "space-between",
            alignItems: "stretch",
            border: "1px solid rgba(255,255,255,0.2)",
            minHeight: "330px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: "0 0 45%",
              maxWidth: "45%",
              minWidth: 0,
              height: "100%",
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
                fontSize: `${homeNameSize}px`,
                opacity: 0.94,
                fontWeight: 700,
                maxWidth: "100%",
                textAlign: "center",
                justifyContent: "center",
                lineHeight: 1.08,
                minHeight: "84px",
                alignItems: "center",
              }}
            >
              {match.home.name}
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-end",
                fontSize: "156px",
                lineHeight: 0.88,
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                marginTop: "auto",
                minHeight: "168px",
                textAlign: "center",
              }}
            >
              {match.goals.home}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "46px",
              fontWeight: 800,
              opacity: 0.86,
              width: "112px",
              height: "112px",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(2,6,23,0.28)",
              border: "1px solid rgba(255,255,255,0.18)",
              flex: "0 0 10%",
              alignSelf: "center",
            }}
          >
            X
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: "0 0 45%",
              maxWidth: "45%",
              minWidth: 0,
              height: "100%",
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
                fontSize: `${awayNameSize}px`,
                opacity: 0.94,
                fontWeight: 700,
                maxWidth: "100%",
                textAlign: "center",
                justifyContent: "center",
                lineHeight: 1.08,
                minHeight: "84px",
                alignItems: "center",
              }}
            >
              {match.away.name}
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                alignItems: "flex-end",
                fontSize: "156px",
                lineHeight: 0.88,
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                marginTop: "auto",
                minHeight: "168px",
                textAlign: "center",
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
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "46px",
            fontWeight: 700,
          }}
        >
          Recap indisponivel no momento
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
