import { ImageResponse } from "next/og";
import { buildTeamRecap } from "@/lib/team-recap";
import { safeHex } from "../../route-utils";
import { trackOperationalEvent } from "@/lib/telemetry";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ matchId: string }>;
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
            color: "white",
            fontFamily: "sans-serif",
            background: `linear-gradient(120deg, ${primary} 0%, ${secondary} 100%)`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              padding: "44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "radial-gradient(circle at 82% 5%, rgba(255,255,255,0.20), transparent 35%)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "20px", letterSpacing: "0.16em", opacity: 0.78 }}>TEAM RECAP</div>
              <div style={{ fontSize: "50px", fontWeight: 900, lineHeight: 1.1 }}>{recap.team.name}</div>
              <div style={{ fontSize: "24px", opacity: 0.86 }}>
                vs {recap.match.opponent} · {dateLabel}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
              <div style={{ fontSize: "108px", fontWeight: 900, lineHeight: 1 }}>
                {recap.match.homeScore}
              </div>
              <div style={{ fontSize: "58px", opacity: 0.65 }}>x</div>
              <div style={{ fontSize: "108px", fontWeight: 900, lineHeight: 1, opacity: 0.8 }}>
                {recap.match.awayScore}
              </div>
              <div
                style={{
                  marginLeft: "20px",
                  borderRadius: "999px",
                  padding: "10px 20px",
                  background: "rgba(255,255,255,0.14)",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {resultLabel}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", borderRadius: "16px", background: "rgba(255,255,255,0.10)", padding: "14px 16px" }}>
                <div style={{ fontSize: "14px", opacity: 0.75 }}>Artilheiro</div>
                <div style={{ marginTop: "4px", fontSize: "20px", fontWeight: 700 }}>{topScorerLabel}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", borderRadius: "16px", background: "rgba(255,255,255,0.10)", padding: "14px 16px" }}>
                <div style={{ fontSize: "14px", opacity: 0.75 }}>Lider em assistencias</div>
                <div style={{ marginTop: "4px", fontSize: "20px", fontWeight: 700 }}>{topAssistantLabel}</div>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
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
            fontSize: "44px",
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          Recap indisponivel no momento
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
