import { buildTeamRecap } from "@/lib/team-recap";
import { safeHex } from "../../route-utils";
import { trackOperationalEvent } from "@/lib/telemetry";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ matchId: string }>;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function svgResponse(svg: string, status = 200) {
  return new Response(svg, {
    status,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=900",
    },
  });
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

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primary}" />
            <stop offset="100%" stop-color="${secondary}" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)" />
        <circle cx="1030" cy="80" r="190" fill="rgba(255,255,255,0.15)" />

        <text x="56" y="72" fill="white" font-family="Arial, sans-serif" font-size="20" letter-spacing="2" opacity="0.8">TEAM RECAP</text>
        <text x="56" y="140" fill="white" font-family="Arial, sans-serif" font-size="54" font-weight="900">${escapeXml(recap.team.name)}</text>
        <text x="56" y="185" fill="white" font-family="Arial, sans-serif" font-size="26" opacity="0.9">vs ${escapeXml(recap.match.opponent)} · ${escapeXml(dateLabel)}</text>

        <text x="56" y="350" fill="white" font-family="Arial, sans-serif" font-size="112" font-weight="900">${recap.match.homeScore}</text>
        <text x="180" y="350" fill="white" font-family="Arial, sans-serif" font-size="60" opacity="0.7">x</text>
        <text x="240" y="350" fill="white" font-family="Arial, sans-serif" font-size="112" font-weight="900" opacity="0.85">${recap.match.awayScore}</text>

        <rect x="430" y="285" width="240" height="52" rx="26" fill="rgba(255,255,255,0.16)" />
        <text x="550" y="318" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="1">${escapeXml(resultLabel)}</text>

        <rect x="56" y="430" width="530" height="120" rx="16" fill="rgba(255,255,255,0.12)" />
        <text x="78" y="464" fill="white" font-family="Arial, sans-serif" font-size="15" opacity="0.82">Artilheiro</text>
        <text x="78" y="505" fill="white" font-family="Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(topScorerLabel)}</text>

        <rect x="614" y="430" width="530" height="120" rx="16" fill="rgba(255,255,255,0.12)" />
        <text x="636" y="464" fill="white" font-family="Arial, sans-serif" font-size="15" opacity="0.82">Lider em assistencias</text>
        <text x="636" y="505" fill="white" font-family="Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(topAssistantLabel)}</text>
      </svg>
    `;

    return svgResponse(svg);
  } catch {
    return svgResponse(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0f172a"/><text x="600" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="700">Recap indisponivel no momento</text></svg>`
    );
  }
}
