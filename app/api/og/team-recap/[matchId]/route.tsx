import { buildTeamRecap } from "@/lib/team-recap";
import { safeHex, OG_CACHE_HEADERS, resolveFormat, OG_DIMENSIONS } from "../../route-utils";
import { resolveTheme } from "../../themes";
import { trackOperationalEvent } from "@/lib/telemetry";
import { renderHtmlToImage } from "../../html-renderer";
import { baseLayout, esc, cut, resolveAssetUrl } from "../../html-templates";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ matchId: string }>;
}

function adaptiveFontSize(text: string, max: number, min: number) {
  if (text.length <= 12) return max;
  if (text.length >= 34) return min;
  const ratio = (text.length - 12) / (34 - 12);
  return Math.round(max - (max - min) * ratio);
}

function fitTeamName(name: string) {
  return name.length > 24 ? `${name.slice(0, 23)}…` : name;
}

function badgeHtml(url: string | null, name: string): string {
  return url
    ? `<img src="${esc(url)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:contain;padding:8%">`
    : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:22px;font-weight:800">${esc(name.slice(0, 2).toUpperCase())}</div>`;
}

export async function GET(request: Request, context: RouteContext) {
  const { matchId } = await context.params;
  const { searchParams } = new URL(request.url);
  const format = resolveFormat(searchParams.get("format"));
  const themeConfig = resolveTheme(searchParams.get("theme"));
  const dims = OG_DIMENSIONS[format];
  const isStories = format === "stories";

  try {
    const recap = await buildTeamRecap(matchId);

    if (!recap) {
      return new Response("Not found", { status: 404 });
    }

    const primary = safeHex(recap.team.primaryColor, "#1d7a61");
    const secondary = safeHex(recap.team.secondaryColor, "#0f172a");
    const teamGoals = recap.match.isHome ? recap.match.homeScore : recap.match.awayScore;
    const opponentGoals = recap.match.isHome ? recap.match.awayScore : recap.match.homeScore;
    const resultLabel = teamGoals > opponentGoals ? "VITORIA" : teamGoals < opponentGoals ? "DERROTA" : "EMPATE";
    const resultClass = resultLabel === "VITORIA" ? "win" : resultLabel === "DERROTA" ? "loss" : "draw";

    const dateLabel = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(recap.match.date);

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

    const titleSize = adaptiveFontSize(teamLabel, 60, 36);
    const subtitleSize = adaptiveFontSize(`${awayName} ${dateLabel}`, 30, 21);
    const recentFormLabel =
      `${recap.recentForm.wins}V ${recap.recentForm.draws}E ${recap.recentForm.losses}D | ` +
      `${recap.recentForm.goalsFor} GF ${recap.recentForm.goalsAgainst} GA`;
    const homeDisplayName = fitTeamName(homeName).toUpperCase();
    const awayDisplayName = fitTeamName(awayName).toUpperCase();
    const fieldLabel = recap.match.isHome ? "Mandante" : "Visitante";

    const stats = [
      { label: "Gols no jogo", value: recap.totals.goals },
      { label: "Assistencias no jogo", value: recap.totals.assists },
      { label: "C. Amarelos", value: recap.totals.yellowCards },
      { label: "C. Vermelhos", value: recap.totals.redCards },
      { label: "Atletas com stats", value: recap.totals.playersWithStats },
    ];

    const content = `
      <div class="card card-padded" style="padding:${isStories ? "30px 28px" : "28px 34px"};gap:0">
        <div class="glow-line"></div>

        <!-- Header row -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0">
            <div class="tracking-wide text-muted" style="font-size:13px;font-weight:600">MATCHDAY RECAP</div>
            <div class="font-black" style="font-size:${titleSize}px;line-height:1;letter-spacing:-0.02em">${esc(teamLabel)}</div>
            <div class="text-muted font-medium" style="font-size:${subtitleSize}px;margin-top:2px">vs ${esc(fitTeamName(awayName))}  ·  ${esc(dateLabel)}</div>
          </div>
          <div class="result-pill-${resultClass} pill" style="font-size:14px;font-weight:800;padding:10px 20px;letter-spacing:0.06em;margin-top:4px">
            ${esc(resultLabel)}
          </div>
        </div>

        <!-- Scoreboard -->
        <div style="display:flex;align-items:center;justify-content:center;gap:0;margin:8px 0 4px">
          <!-- Home side -->
          <div style="display:flex;flex-direction:column;align-items:center;width:38%;gap:8px">
            <div class="badge" style="width:130px;height:130px;border-width:3px;box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 80px ${primary}18">${badgeHtml(homeBadge, homeName)}</div>
            <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.85;text-align:center;line-height:1.2">${esc(homeDisplayName)}</div>
            <div class="mono font-black tabular" style="font-size:80px;line-height:0.85;text-shadow:0 8px 40px rgba(0,0,0,0.5)">${recap.match.homeScore}</div>
          </div>

          <!-- Separator -->
          <div style="display:flex;flex-direction:column;align-items:center;width:24%;gap:6px">
            <div style="width:1px;height:32px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)"></div>
            <div style="width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);font-size:20px;font-weight:800;opacity:0.5">×</div>
            <div style="width:1px;height:32px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)"></div>
          </div>

          <!-- Away side -->
          <div style="display:flex;flex-direction:column;align-items:center;width:38%;gap:8px">
            <div class="badge" style="width:130px;height:130px;border-width:3px;box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 80px ${primary}18">${badgeHtml(awayBadge, awayName)}</div>
            <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.85;text-align:center;line-height:1.2">${esc(awayDisplayName)}</div>
            <div class="mono font-black tabular" style="font-size:80px;line-height:0.85;text-shadow:0 8px 40px rgba(0,0,0,0.5)">${recap.match.awayScore}</div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Stats row + leaders -->
        <div style="display:flex;gap:10px;margin-top:12px">
          <div class="stat-tile" style="flex:1">
            <div class="label">Artilheiro</div>
            <div class="font-bold" style="font-size:22px;margin-top:2px">${esc(cut(topScorerLabel, 28))}</div>
          </div>
          <div class="stat-tile" style="flex:1">
            <div class="label">Assistências</div>
            <div class="font-bold" style="font-size:22px;margin-top:2px">${esc(cut(topAssistantLabel, 28))}</div>
          </div>
          ${stats.map((s) => `
            <div class="stat-tile" style="width:100px;flex-shrink:0">
              <div class="label">${esc(s.label)}</div>
              <div class="font-extrabold mono" style="font-size:28px;margin-top:2px">${s.value}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    const html = baseLayout({
      width: dims.width,
      height: dims.height,
      theme: themeConfig,
      primary,
      secondary,
      content,
    });

    const png = await renderHtmlToImage(html, dims);
    return new Response(png, {
      headers: { "Content-Type": "image/png", ...OG_CACHE_HEADERS },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    trackOperationalEvent("recap_team_card_failed", { matchId, message });

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
