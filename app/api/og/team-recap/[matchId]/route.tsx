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
              margin: "36px",
              borderRadius: "30px",
              display: "flex",
              flexDirection: "column",
              width: "calc(100% - 72px)",
              height: "calc(100% - 72px)",
              padding: "34px 38px",
              background: "rgba(0,0,0,0.18)",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "74%" }}>
                <div style={{ display: "flex", fontSize: "18px", letterSpacing: "0.16em", opacity: 0.84 }}>
                  MATCHDAY RECAP
                </div>
                <div style={{ display: "flex", fontSize: "64px", fontWeight: 900, lineHeight: 1.02 }}>
                  {cut(recap.team.name, 28)}
                </div>
                <div style={{ display: "flex", fontSize: "30px", opacity: 0.92 }}>
                  vs {cut(recap.match.opponent, 30)} | {dateLabel}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "130px",
                  height: "130px",
                  borderRadius: "28px",
                  background: "rgba(255,255,255,0.18)",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {teamBadgeUrl ? (
                  <img
                    src={teamBadgeUrl}
                    alt={recap.team.name}
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", fontSize: "44px", fontWeight: 900 }}>
                    {recap.team.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "10px" }}>
              <div
                style={{
                  display: "flex",
                  borderRadius: "999px",
                  background: resultTone,
                  padding: "10px 16px",
                  fontSize: "18px",
                  minWidth: "180px",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                  Resultado: {resultLabel}
              </div>
              <div
                style={{
                  display: "flex",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.14)",
                  padding: "10px 16px",
                  fontSize: "17px",
                  maxWidth: "690px",
                }}
              >
                Forma recente: {recentFormLabel}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                borderRadius: "26px",
                background: "rgba(255,255,255,0.14)",
                padding: "28px 30px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "300px", gap: "6px" }}>
                <div style={{ display: "flex", fontSize: "14px", letterSpacing: "0.12em", opacity: 0.72 }}>CASA</div>
                <div
                  style={{
                    display: "flex",
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
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
                    <div style={{ display: "flex", fontSize: "22px", fontWeight: 800 }}>
                      {homeName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", fontSize: "22px", opacity: 0.86 }}>{homeName}</div>
                <div style={{ display: "flex", fontSize: "108px", fontWeight: 900 }}>{homeScore}</div>
              </div>

              <div style={{ display: "flex", fontSize: "42px", fontWeight: 800, opacity: 0.86 }}>x</div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "300px", gap: "6px" }}>
                <div style={{ display: "flex", fontSize: "14px", letterSpacing: "0.12em", opacity: 0.72 }}>VISITANTE</div>
                <div
                  style={{
                    display: "flex",
                    width: "64px",
                    height: "64px",
                    borderRadius: "16px",
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
                    <div style={{ display: "flex", fontSize: "22px", fontWeight: 800 }}>
                      {awayName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", fontSize: "22px", opacity: 0.86 }}>{awayName}</div>
                <div style={{ display: "flex", fontSize: "108px", fontWeight: 900 }}>{awayScore}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.14)",
                  width: "50%",
                  padding: "14px 18px",
                }}
              >
                <div style={{ display: "flex", fontSize: "16px", opacity: 0.84 }}>Artilheiro</div>
                <div style={{ display: "flex", fontSize: "30px", fontWeight: 700 }}>{cut(topScorerLabel, 34)}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "18px",
                  background: "rgba(255,255,255,0.14)",
                  width: "50%",
                  padding: "14px 18px",
                }}
              >
                <div style={{ display: "flex", fontSize: "16px", opacity: 0.84 }}>Lider em assistencias</div>
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
