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
    const confirmedList = recap.attendance.confirmed.slice(0, 4).map((p: { name: string; position: string }) => {
      const positionLabel = p.position ? ` (${p.position})` : '';
      return `<div style="font-size:14px;font-weight:600;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);padding:6px 12px;border-radius:10px;display:flex;align-items:center;gap:4px;color:white">
        <span style="color:#34d399">✓</span> ${esc(cut(p.name, 14))}${esc(positionLabel)}
      </div>`;
    }).join("");

    const topScorerText = recap.topScorer 
      ? `${recap.topScorer.name} (${recap.topScorer.goals} Gols)`
      : "Nenhum gol registrado";

    let content: string;
    if (isStories) {
      const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(recap.match.date).toUpperCase();
      const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(recap.match.date).toUpperCase().replace(".", "");
      const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(recap.match.date);
      const headerDateText = `${dayMonth} | ${weekday} | ${time}H`;

      content = `
        <div class="card" style="margin:0;border-radius:0;border:none;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:80px 0;background:#f7f7f7;position:relative">
          
          <!-- Textured white overlay and crumpled creases -->
          <div style="position:absolute;inset:0;opacity:0.04;background-image:url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.04\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E');mix-blend-mode:multiply;pointer-events:none"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,0.015) 0%,rgba(255,255,255,0.4) 50%,rgba(0,0,0,0.015) 100%),linear-gradient(220deg,rgba(0,0,0,0.01) 0%,rgba(255,255,255,0.3) 60%,rgba(0,0,0,0.01) 100%);mix-blend-mode:overlay;pointer-events:none"></div>

          <!-- Giant Faded Team Watermark Logo in center -->
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;opacity:0.05;pointer-events:none;display:flex;align-items:center;justify-content:center">
            ${badgeHtml(teamBadgeUrl, teamLabel)}
          </div>

          <!-- Top part: formatted date and bold matchup names -->
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;gap:12px;z-index:2;padding:0 48px;">
            <div style="font-size:24px;font-weight:700;color:rgba(0,0,0,0.6);letter-spacing:0.1em;opacity:0.85;text-align:center;text-transform:uppercase;font-family:'Inter',sans-serif">
              ${esc(headerDateText)}
            </div>
            
            <div style="font-size:64px;font-weight:900;letter-spacing:-0.02em;text-align:center;text-transform:uppercase;line-height:1.1;margin-top:10px;width:100%;font-family:'Inter',sans-serif">
              ${recap.match.isHome ? `
                <div style="color:#e11d48;font-weight:900">${esc(teamLabel.toUpperCase())} X</div>
                <div style="color:black;font-weight:900;margin-top:8px">${esc(opponentLabel.toUpperCase())}</div>
              ` : `
                <div style="color:black;font-weight:900">${esc(opponentLabel.toUpperCase())} X</div>
                <div style="color:#e11d48;font-weight:900;margin-top:8px">${esc(teamLabel.toUpperCase())}</div>
              `}
            </div>
          </div>

          <!-- Scoreboard / Badge part with giant X -->
          <div style="display:flex;align-items:center;justify-content:center;gap:40px;width:100%;margin-top:-20px;position:relative;z-index:2;padding:0 48px;">
            <!-- Home badge -->
            <div class="badge badge-lg" style="width:200px;height:200px;border:4px solid white;box-shadow:0 12px 36px rgba(0,0,0,0.15);background:white;border-radius:50%">
              ${badgeHtml(homeBadge, homeName)}
            </div>
            
            <!-- Giant X -->
            <div style="font-size:64px;font-weight:300;color:rgba(0,0,0,0.6);margin:0 20px;font-family:'Inter',sans-serif">X</div>
            
            <!-- Away badge -->
            <div class="badge badge-lg" style="width:200px;height:200px;border:4px solid white;box-shadow:0 12px 36px rgba(0,0,0,0.15);background:white;border-radius:50%">
              ${badgeHtml(awayBadge, awayName)}
            </div>
          </div>

          <!-- Bottom: red cut bar and stadium venue details -->
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;z-index:2">
            
            <!-- Watermark and Red Bar container -->
            <div style="display:flex;flex-direction:column;align-items:center;width:100%;position:relative;margin-top:20px;margin-bottom:20px;">
              
              <!-- Giant AVANTE Watermark -->
              <div style="font-family:'Inter',sans-serif;font-size:110px;font-weight:900;color:transparent;-webkit-text-stroke:2px rgba(0,0,0,0.06);letter-spacing:0.1em;text-align:center;text-transform:uppercase;width:100%;margin-bottom:-45px;line-height:1">
                AVANTE
              </div>

              <!-- Red Cutting Bar -->
              <div style="background:#e11d48;width:100%;padding:18px 0;display:flex;justify-content:center;align-items:center;z-index:2;box-shadow:0 8px 24px rgba(225,29,72,0.2)">
                <div style="font-size:28px;font-weight:900;color:black;letter-spacing:0.5em;text-transform:uppercase;text-align:center;padding-left:0.5em;font-family:'Inter',sans-serif">
                  ${recap.match.type === "FRIENDLY" ? "AMISTOSO" : "CAMPEONATO"}
                </div>
              </div>

              <!-- Giant MCFC Watermark -->
              <div style="font-family:'Inter',sans-serif;font-size:110px;font-weight:900;color:transparent;-webkit-text-stroke:2px rgba(0,0,0,0.06);letter-spacing:0.1em;text-align:center;text-transform:uppercase;width:100%;margin-top:-45px;line-height:1">
                ${esc(recap.team.shortName || "MCFC")}
              </div>

            </div>

            <!-- Venue & Icon -->
            <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:10px">
              <div style="font-size:28px;font-weight:900;color:black;text-transform:uppercase;letter-spacing:0.05em;text-align:center;font-family:'Inter',sans-serif">
                ${esc(recap.match.venue.toUpperCase())}
              </div>
              
              <!-- Stadium Icon -->
              <div style="display:flex;align-items:center;justify-content:center;margin-top:8px">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a10 10 0 0 0-10 10v1a8 8 0 0 0 16 0v-1A10 10 0 0 0 12 2z"></path>
                  <path d="M12 10V2"></path>
                  <path d="M12 14v8"></path>
                  <path d="M6.5 12h11"></path>
                </svg>
              </div>
            </div>

          </div>

        </div>`;
    } else {
      content = `
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
            <!-- Left Col: Details -->
            <div style="flex:1.2;display:flex;flex-direction:column;gap:10px">
              <div class="stat-tile" style="flex:1;padding:16px 20px;justify-content:center">
                <div class="label" style="text-transform:uppercase;font-size:11px;letter-spacing:0.05em">Informações da Partida</div>
                <div class="font-bold" style="font-size:18px;margin-top:8px;color:white">📍 ${esc(cut(recap.match.venue, 32))}</div>
                <div class="font-semibold" style="font-size:16px;margin-top:6px;color:var(--text-muted)">📅 ${esc(dateLabel)}</div>
                <div class="font-semibold" style="font-size:15px;margin-top:6px;color:var(--text-muted)">🏆 ${recap.match.type === "FRIENDLY" ? "Jogo Amistoso" : "Jogo de Campeonato"}</div>
              </div>
            </div>

            <!-- Right Col: Form & Team Highlight -->
            <div style="flex:1;display:flex;flex-direction:column;gap:10px">
              <div class="stat-tile" style="flex:1;padding:12px 16px">
                <div class="label" style="text-transform:uppercase;font-size:11px;letter-spacing:0.05em">Últimos Resultados</div>
                <div class="font-extrabold" style="font-size:22px;margin-top:4px;color:#6ee7b7">${recentFormLabel}</div>
                <div class="label" style="font-size:12px;margin-top:2px">${recap.recentForm.goalsFor} gols marcados / ${recap.recentForm.goalsAgainst} sofridos</div>
              </div>

              <div class="stat-tile" style="flex:1;padding:12px 16px">
                <div class="label" style="text-transform:uppercase;font-size:11px;letter-spacing:0.05em">Destaque do Time</div>
                <div class="font-extrabold" style="font-size:18px;margin-top:4px;color:#fbbf24">⚽ ${esc(cut(topScorerText, 26))}</div>
              </div>
            </div>
          </div>
        </div>`;
    }

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
