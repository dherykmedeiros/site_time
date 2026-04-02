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

    const teamName = escapeXml(cut(recap.team.name, 26));
    const opponentName = escapeXml(cut(recap.match.opponent, 26));
    const scorerName = escapeXml(cut(topScorerLabel, 34));
    const assistantName = escapeXml(cut(topAssistantLabel, 34));

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${primary}" />
            <stop offset="100%" stop-color="${secondary}" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.22)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.08)" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)" />
        <circle cx="1040" cy="-90" r="300" fill="rgba(255,255,255,0.10)" />
        <rect x="36" y="34" width="1128" height="562" rx="30" fill="rgba(0,0,0,0.14)" />

        <text x="76" y="92" fill="white" font-family="Arial, sans-serif" font-size="20" letter-spacing="3" opacity="0.86">TEAM RECAP</text>
        <text x="76" y="152" fill="white" font-family="Arial, sans-serif" font-size="58" font-weight="900">${teamName}</text>
        <text x="76" y="198" fill="white" font-family="Arial, sans-serif" font-size="30" opacity="0.92">vs ${opponentName} · ${escapeXml(dateLabel)}</text>

        <rect x="76" y="232" width="220" height="44" rx="22" fill="url(#glass)" />
        <text x="186" y="261" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="700">${escapeXml(resultLabel)}</text>

        <rect x="340" y="250" width="780" height="190" rx="30" fill="rgba(255,255,255,0.14)" />
        <text x="500" y="365" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="132" font-weight="900">${recap.match.homeScore}</text>
        <text x="730" y="360" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="74" opacity="0.7">x</text>
        <text x="960" y="365" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="132" font-weight="900" opacity="0.86">${recap.match.awayScore}</text>

        <rect x="76" y="462" width="520" height="110" rx="18" fill="rgba(255,255,255,0.14)" />
        <text x="98" y="496" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.84">Artilheiro</text>
        <text x="98" y="540" fill="white" font-family="Arial, sans-serif" font-size="34" font-weight="700">${scorerName}</text>

        <rect x="624" y="462" width="500" height="110" rx="18" fill="rgba(255,255,255,0.14)" />
        <text x="646" y="496" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.84">Lider em assistencias</text>
        <text x="646" y="540" fill="white" font-family="Arial, sans-serif" font-size="34" font-weight="700">${assistantName}</text>
      </svg>
    `;

    return svgResponse(svg);
  } catch {
    return svgResponse(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0f172a"/><text x="600" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="700">Recap indisponivel no momento</text></svg>`
    );
  }
}
