import { buildPlayerRecap } from "@/lib/player-recap";
import { safeHex } from "../../route-utils";
import { trackOperationalEvent } from "@/lib/telemetry";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ playerId: string }>;
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

export async function GET(_request: Request, context: RouteContext) {
  const { playerId } = await context.params;

  try {
    const recap = await buildPlayerRecap(playerId);

    if (!recap) {
      return new Response("Not found", { status: 404 });
    }

    const primary = safeHex(recap.team.primaryColor, "#1d7a61");
    const secondary = safeHex(recap.team.secondaryColor, "#0f172a");
    const recentBadge = recap.lastFive.matches > 0
      ? `${recap.lastFive.goals}G ${recap.lastFive.assists}A nos ultimos ${recap.lastFive.matches}`
      : "Sem partidas recentes";

    trackOperationalEvent("recap_player_card_viewed", {
      playerId,
      teamId: recap.team.id,
      matches: recap.career.matches,
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
        <circle cx="180" cy="120" r="200" fill="rgba(255,255,255,0.15)" />

        <text x="64" y="72" fill="white" font-family="Arial, sans-serif" font-size="20" letter-spacing="2" opacity="0.8">PLAYER RECAP</text>
        <text x="64" y="160" fill="white" font-family="Arial, sans-serif" font-size="64" font-weight="900">${escapeXml(recap.player.name)}</text>
        <text x="64" y="205" fill="white" font-family="Arial, sans-serif" font-size="26" opacity="0.9">${escapeXml(recap.team.name)}</text>

        <rect x="64" y="292" width="220" height="110" rx="18" fill="rgba(255,255,255,0.14)" />
        <rect x="304" y="292" width="220" height="110" rx="18" fill="rgba(255,255,255,0.14)" />
        <rect x="544" y="292" width="220" height="110" rx="18" fill="rgba(255,255,255,0.14)" />

        <text x="84" y="325" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.85">Partidas</text>
        <text x="84" y="372" fill="white" font-family="Arial, sans-serif" font-size="40" font-weight="800">${recap.career.matches}</text>

        <text x="324" y="325" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.85">Gols</text>
        <text x="324" y="372" fill="white" font-family="Arial, sans-serif" font-size="40" font-weight="800">${recap.career.goals}</text>

        <text x="564" y="325" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.85">Assistencias</text>
        <text x="564" y="372" fill="white" font-family="Arial, sans-serif" font-size="40" font-weight="800">${recap.career.assists}</text>

        <text x="64" y="560" fill="white" font-family="Arial, sans-serif" font-size="22" opacity="0.92">${escapeXml(recentBadge)}</text>
        <text x="1020" y="560" fill="white" font-family="Arial, sans-serif" font-size="16" opacity="0.7">VARzea recap</text>
      </svg>
    `;

    return svgResponse(svg);
  } catch {
    return svgResponse(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0f172a"/><text x="600" y="320" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="700">Recap indisponivel no momento</text></svg>`
    );
  }
}
