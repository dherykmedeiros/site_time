import { ImageResponse } from "next/og";
import { buildTeamRecap } from "@/lib/team-recap";
import { safeHex } from "../../route-utils";
import { trackOperationalEvent } from "@/lib/telemetry";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ matchId: string }>;
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

export async function GET(_request: Request, context: RouteContext) {
  const { matchId } = await context.params;

  try {
    const recap = await buildTeamRecap(matchId);

    if (!recap) {
      return new Response("Not found", { status: 404 });
    }

    const primary = safeHex(recap.team.primaryColor, "#1d7a61");
    const secondary = safeHex(recap.team.secondaryColor, "#0f172a");
    const resultLabel = buildResultLabel(recap.match.homeScore, recap.match.awayScore);
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

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            position: "relative",
            fontFamily: "Arial, sans-serif",
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
              padding: "40px",
              background: "rgba(0,0,0,0.18)",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", fontSize: "20px", letterSpacing: "0.16em", opacity: 0.84 }}>
                TEAM RECAP
              </div>
              <div style={{ display: "flex", fontSize: "66px", fontWeight: 900, lineHeight: 1.02 }}>
                {cut(recap.team.name, 30)}
              </div>
              <div style={{ display: "flex", fontSize: "31px", opacity: 0.92 }}>
                vs {cut(recap.match.opponent, 32)} | {dateLabel}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "8px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.16)",
                  padding: "10px 16px",
                  fontSize: "19px",
                  maxWidth: "420px",
                  justifyContent: "center",
                }}
              >
                {resultLabel}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                borderRadius: "26px",
                background: "rgba(255,255,255,0.14)",
                padding: "34px 30px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "300px" }}>
                <div style={{ display: "flex", fontSize: "22px", opacity: 0.86 }}>Nosso time</div>
                <div style={{ display: "flex", fontSize: "108px", fontWeight: 900 }}>{recap.match.homeScore}</div>
              </div>

              <div style={{ display: "flex", fontSize: "42px", fontWeight: 800, opacity: 0.86 }}>x</div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "300px" }}>
                <div style={{ display: "flex", fontSize: "22px", opacity: 0.86 }}>Adversario</div>
                <div style={{ display: "flex", fontSize: "108px", fontWeight: 900 }}>{recap.match.awayScore}</div>
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
