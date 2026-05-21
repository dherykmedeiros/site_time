import { buildTeamPregameRecap } from "@/lib/team-recap";
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
    ? `<img src="${esc(url)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
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
    const recap = await buildTeamPregameRecap(matchId);

    if (!recap) {
      return new Response("Not found", { status: 404 });
    }

    const primary = safeHex(recap.team.primaryColor, "#1d7a61");
    const secondary = safeHex(recap.team.secondaryColor, "#0f172a");

    const dateLabel = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(recap.match.date);

    trackOperationalEvent("recap_pregame_card_viewed", {
      matchId,
      teamId: recap.team.id,
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
    const subtitleSize = adaptiveFontSize(`vs ${opponentLabel}`, 30, 21);

    const recentFormLabel =
      `${recap.recentForm.wins}V ${recap.recentForm.draws}E ${recap.recentForm.losses}D`;

    const homeDisplayName = fitTeamName(homeName).toUpperCase();
    const awayDisplayName = fitTeamName(awayName).toUpperCase();

    // Show top 4 confirmed players list
    const confirmedList = recap.attendance.confirmed.slice(0, 4).map(p => {
      const positionLabel = p.position ? ` (${p.position})` : '';
      return `<div style="font-size:14px;font-weight:600;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);padding:6px 12px;border-radius:10px;display:flex;align-items:center;gap:4px;color:white">
        <span style="color:#34d399">✓</span> ${esc(cut(p.name, 14))}${esc(positionLabel)}
      </div>`;
    }).join("");

    const topScorerText = recap.topScorer 
      ? `${recap.topScorer.name} (${recap.topScorer.goals} Gols)`
      : "Nenhum gol registrado";

    const content = `
      <div class="card card-padded" style="padding:${isStories ? "30px 28px" : "28px 34px"};gap:0">
        <div class="glow-line"></div>

        <!-- Header row -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0">
            <div class="tracking-wide text-muted" style="font-size:13px;font-weight:600;color:#34d399;font-weight:700">MATCHDAY PREVIEW</div>
            <div class="font-black" style="font-size:${titleSize}px;line-height:1;letter-spacing:-0.02em">${esc(teamLabel)}</div>
            <div class="text-muted font-medium" style="font-size:${subtitleSize}px;margin-top:2px">vs ${esc(fitTeamName(opponentLabel))}</div>
          </div>
          <div class="result-pill-win pill" style="font-size:14px;font-weight:800;padding:10px 20px;letter-spacing:0.06em;margin-top:4px;background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.3);color:#6ee7b7">
            PRÉ-JOGO
          </div>
        </div>

        <!-- Details & Match Info Row -->
        <div style="display:flex;gap:24px;margin:18px 0 10px;align-items:center;justify-content:center">
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            <div class="badge" style="width:110px;height:110px;border-width:3px;box-shadow:0 16px 48px rgba(0,0,0,0.4),0 0 60px ${primary}18">${badgeHtml(homeBadge, homeName)}</div>
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.85;text-align:center;line-height:1.2;margin-top:4px">${esc(homeDisplayName)}</div>
          </div>

          <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            <div style="font-size:16px;font-weight:800;color:var(--text-muted)">VS</div>
            <div style="width:1px;height:40px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)"></div>
          </div>

          <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            <div class="badge" style="width:110px;height:110px;border-width:3px;box-shadow:0 16px 48px rgba(0,0,0,0.4),0 0 60px ${primary}18">${badgeHtml(awayBadge, awayName)}</div>
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.85;text-align:center;line-height:1.2;margin-top:4px">${esc(awayDisplayName)}</div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Main Info Columns -->
        <div style="display:flex;gap:16px;margin-top:12px;flex:1">
          <!-- Left Col: Details & Attendance stats -->
          <div style="flex:1.2;display:flex;flex-direction:column;gap:10px">
            <div class="stat-tile" style="flex:1;padding:12px 16px;justify-content:center">
              <div class="label" style="text-transform:uppercase;font-size:11px;letter-spacing:0.05em">Informações da Partiva</div>
              <div class="font-bold" style="font-size:17px;margin-top:4px;color:white">📍 ${esc(cut(recap.match.venue, 32))}</div>
              <div class="font-semibold" style="font-size:15px;margin-top:2px;color:var(--text-muted)">📅 ${esc(dateLabel)}</div>
              <div class="font-semibold" style="font-size:14px;margin-top:2px;color:var(--text-muted)">🏆 ${recap.match.type === "FRIENDLY" ? "Jogo Amistoso" : "Jogo de Campeonato"}</div>
            </div>

            <div style="display:flex;gap:10px">
              <div class="stat-tile" style="flex:1;padding:12px 14px;align-items:center;text-align:center">
                <div class="label" style="font-size:10px">CONFIRMADOS</div>
                <div class="font-extrabold mono" style="font-size:28px;color:#34d399">${recap.attendance.confirmedCount}</div>
              </div>
              <div class="stat-tile" style="flex:1;padding:12px 14px;align-items:center;text-align:center">
                <div class="label" style="font-size:10px">AGUARDANDO</div>
                <div class="font-extrabold mono" style="font-size:28px;color:#fbbf24">${recap.attendance.pendingCount}</div>
              </div>
              <div class="stat-tile" style="flex:1;padding:12px 14px;align-items:center;text-align:center">
                <div class="label" style="font-size:10px">AUSENTES</div>
                <div class="font-extrabold mono" style="font-size:28px;color:#f87171">${recap.attendance.declinedCount}</div>
              </div>
            </div>
          </div>

          <!-- Right Col: Form & Top Scorer Hype -->
          <div style="flex:1;display:flex;flex-direction:column;gap:10px">
            <div class="stat-tile" style="flex:1;padding:12px 16px">
              <div class="label" style="text-transform:uppercase;font-size:11px;letter-spacing:0.05em">Últimos Resultados</div>
              <div class="font-extrabold" style="font-size:22px;margin-top:4px;color:#6ee7b7">${recentFormLabel}</div>
              <div class="label" style="font-size:12px;margin-top:2px">${recap.recentForm.goalsFor} gols marcados / ${recap.recentForm.goalsAgainst} sofridos</div>
            </div>

            <div class="stat-tile" style="flex:1;padding:12px 16px">
              <div class="label" style="text-transform:uppercase;font-size:11px;letter-spacing:0.05em">Artilheiro do Time</div>
              <div class="font-extrabold" style="font-size:18px;margin-top:4px;color:#fbbf24">⚽ ${esc(cut(topScorerText, 26))}</div>
            </div>
          </div>
        </div>

        <!-- Confirmed list avatars/chips (Bottom row) -->
        ${confirmedList.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:4px;margin-top:14px">
            <div class="label" style="font-size:11px;color:var(--text-muted);text-transform:uppercase;font-weight:600;letter-spacing:0.05em">Alguns convocados:</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              ${confirmedList}
            </div>
          </div>
        ` : ""}

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
    console.error(`[og/pregame-recap] matchId=${matchId} error=${message}`);
    
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
    Matchday Preview
  </text>
  <text x="600" y="350" fill="#94a3b8" text-anchor="middle" font-family="Arial, sans-serif" font-size="30">
    Pre-jogo indisponivel no momento
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
