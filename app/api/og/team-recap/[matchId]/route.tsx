import { ImageResponse } from "next/og";
import { buildTeamRecap } from "@/lib/team-recap";
import { safeHex } from "../../route-utils";
import { trackOperationalEvent } from "@/lib/telemetry";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ matchId: string }>;
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

function buildResultLabel(home: number, away: number) {
  if (home > away) return "VITORIA";
  if (home < away) return "DERROTA";
  return "EMPATE";
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

    const resultTone =
      resultLabel === "VITORIA"
        ? "rgba(16, 185, 129, 0.32)"
        : resultLabel === "DERROTA"
          ? "rgba(239, 68, 68, 0.30)"
          : "rgba(234, 179, 8, 0.30)";

    const teamBadgeUrl = resolveAssetUrl(recap.team.badgeUrl, request.url);
    const opponentBadgeUrl = resolveAssetUrl(recap.match.opponentBadgeUrl, request.url);
    const teamLabel = recap.team.shortName || cut(recap.team.name, 16);
    const opponentLabel = cut(recap.match.opponent, 16);
    const homeName = recap.match.isHome ? teamLabel : opponentLabel;
    const awayName = recap.match.isHome ? opponentLabel : teamLabel;
    const homeBadge = recap.match.isHome ? teamBadgeUrl : opponentBadgeUrl;
    const awayBadge = recap.match.isHome ? opponentBadgeUrl : teamBadgeUrl;
    const homeScore = recap.match.homeScore;
    const awayScore = recap.match.awayScore;
    const recentFormLabel =
      recap.recentForm.matches > 0
        ? `${recap.recentForm.wins}V ${recap.recentForm.draws}E ${recap.recentForm.losses}D | ${recap.recentForm.goalsFor} GF ${recap.recentForm.goalsAgainst} GA`
        : "Sem historico recente";

    return new ImageResponse(
      (
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <div style={{ display: "flex", fontSize: "17px", letterSpacing: "0.16em", opacity: 0.84 }}>
                  MATCHDAY RECAP
                </div>
                <div style={{ display: "flex", fontSize: "60px", fontWeight: 900, lineHeight: 1.02 }}>
                  {teamLabel}
                </div>
                <div style={{ display: "flex", fontSize: "30px", opacity: 0.92 }}>
                  vs {cut(recap.match.opponent, 24)} | {dateLabel}
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
                }}
              >
                FINAL | {resultLabel}
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
                Campo: {recap.match.isHome ? "Mandante" : "Visitante"}
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
                alignItems: "center",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "300px", gap: "8px" }}>
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
                    <div style={{ display: "flex", fontSize: "22px", fontWeight: 800 }}>
                      {homeName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", fontSize: "24px", opacity: 0.94, fontWeight: 700 }}>{homeName}</div>
                <div style={{ display: "flex", fontSize: "156px", lineHeight: 0.9, fontWeight: 900 }}>{homeScore}</div>
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
                }}
              >
                X
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "300px", gap: "8px" }}>
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
                    <div style={{ display: "flex", fontSize: "22px", fontWeight: 800 }}>
                      {awayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", fontSize: "24px", opacity: 0.94, fontWeight: 700 }}>{awayName}</div>
                <div style={{ display: "flex", fontSize: "156px", lineHeight: 0.9, fontWeight: 900 }}>{awayScore}</div>
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
                <div style={{ display: "flex", fontSize: "30px", fontWeight: 700 }}>{cut(topScorerLabel, 34)}</div>
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
                  {cut(topAssistantLabel, 34)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { label: "Gols no jogo", value: recap.totals.goals },
                { label: "Assistencias no jogo", value: recap.totals.assists },
                { label: "Atletas com stats", value: recap.totals.playersWithStats },
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
      ),
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
