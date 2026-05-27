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
      const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(recap.match.date).toUpperCase();
      const dayMonth = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(recap.match.date).toUpperCase().replace(".", "");
      const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(recap.match.date);
      const headerDateText = `${dayMonth} | ${weekday} | ${time}H`;

      content = `
        <div class="card" style="margin:0;border-radius:0;border:none;width:100%;height:100%;display:flex;flex-direction:row;background:#f7f7f7;position:relative;padding:0">
          
          <!-- Textured white overlay and crumpled creases -->
          <div style="position:absolute;inset:0;opacity:0.04;background-image:url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.04\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E');mix-blend-mode:multiply;pointer-events:none"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,0.015) 0%,rgba(255,255,255,0.4) 50%,rgba(0,0,0,0.015) 100%),linear-gradient(220deg,rgba(0,0,0,0.01) 0%,rgba(255,255,255,0.3) 60%,rgba(0,0,0,0.01) 100%);mix-blend-mode:overlay;pointer-events:none"></div>

          <!-- Giant Faded Team Watermark Logo in center -->
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:400px;opacity:0.04;pointer-events:none;display:flex;align-items:center;justify-content:center">
            ${badgeHtml(teamBadgeUrl, teamLabel)}
          </div>

          <!-- Left Column (46% width) -->
          <div style="width:46%;display:flex;flex-direction:column;justify-content:space-between;padding:48px 40px;border-right:1px solid rgba(0,0,0,0.06);z-index:2">
            
            <!-- Date & Header block -->
            <div style="display:flex;flex-direction:column;gap:8px">
              <div style="font-size:16px;font-weight:700;color:rgba(0,0,0,0.5);letter-spacing:0.08em;text-transform:uppercase">
                ${esc(headerDateText)}
              </div>
              
              <div style="font-size:42px;font-weight:900;letter-spacing:-0.02em;text-transform:uppercase;line-height:1.1;margin-top:6px;font-family:'Inter',sans-serif">
                ${recap.match.isHome ? `
                  <div style="color:#e11d48;font-weight:900">${esc(teamLabel.toUpperCase())} X</div>
                  <div style="color:black;font-weight:900;margin-top:4px">${esc(opponentLabel.toUpperCase())}</div>
                ` : `
                  <div style="color:black;font-weight:900">${esc(opponentLabel.toUpperCase())} X</div>
                  <div style="color:#e11d48;font-weight:900;margin-top:4px">${esc(teamLabel.toUpperCase())}</div>
                `}
              </div>
            </div>

            <!-- Outlined watermarks with red banner -->
            <div style="display:flex;flex-direction:column;align-items:center;width:100%;position:relative;margin:24px 0">
              
              <!-- Giant AVANTE Watermark -->
              <div style="font-family:'Inter',sans-serif;font-size:72px;font-weight:900;color:transparent;-webkit-text-stroke:1.5px rgba(0,0,0,0.06);letter-spacing:0.1em;text-align:center;text-transform:uppercase;width:100%;margin-bottom:-30px;line-height:1">
                AVANTE
              </div>

              <!-- Red Cutting Bar -->
              <div style="background:#e11d48;width:115%;padding:12px 0;display:flex;justify-content:center;align-items:center;z-index:2;box-shadow:0 6px 16px rgba(225,29,72,0.2)">
                <div style="font-size:20px;font-weight:900;color:black;letter-spacing:0.4em;text-transform:uppercase;text-align:center;padding-left:0.4em;font-family:'Inter',sans-serif">
                  ${recap.match.type === "FRIENDLY" ? "AMISTOSO" : "CAMPEONATO"}
                </div>
              </div>

              <!-- Giant MCFC Watermark -->
              <div style="font-family:'Inter',sans-serif;font-size:72px;font-weight:900;color:transparent;-webkit-text-stroke:1.5px rgba(0,0,0,0.06);letter-spacing:0.1em;text-align:center;text-transform:uppercase;width:100%;margin-top:-30px;line-height:1">
                ${esc(recap.team.shortName || "MCFC")}
              </div>

            </div>

            <!-- Venue -->
            <div style="font-size:20px;font-weight:900;color:black;text-transform:uppercase;letter-spacing:0.05em;display:flex;align-items:center;gap:8px">
              📍 ${esc(cut(recap.match.venue.toUpperCase(), 32))}
            </div>

          </div>

          <!-- Right Column (54% width) -->
          <div style="width:54%;display:flex;flex-direction:column;justify-content:space-between;padding:48px;z-index:2">
            
            <!-- Badges Center Scoreboard -->
            <div style="display:flex;align-items:center;justify-content:center;gap:32px;width:100%;margin-top:10px">
              <!-- Home badge container with clean light frame -->
              <div style="width:130px;height:130px;border-radius:50%;background:white;box-shadow:0 8px 24px rgba(0,0,0,0.08);padding:4px;display:flex;align-items:center;justify-content:center;">
                ${badgeHtml(homeBadge, homeName)}
              </div>

              <!-- Center thin VS -->
              <div style="font-size:32px;font-weight:300;color:rgba(0,0,0,0.4);font-family:'Inter',sans-serif">VS</div>

              <!-- Away badge container with clean light frame -->
              <div style="width:130px;height:130px;border-radius:50%;background:white;box-shadow:0 8px 24px rgba(0,0,0,0.08);padding:4px;display:flex;align-items:center;justify-content:center;">
                ${badgeHtml(awayBadge, awayName)}
              </div>
            </div>

            <!-- Tiles section (Form & Featured Player) -->
            <div style="display:flex;flex-direction:column;gap:12px;width:100%;margin-top:20px">
              
              <!-- Recent Form Tile -->
              <div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);padding:16px 20px;border-radius:18px;display:flex;flex-direction:column;gap:4px">
                <div style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.4);letter-spacing:0.05em;text-transform:uppercase">Últimos Resultados</div>
                <div style="display:flex;align-items:baseline;justify-content:space-between;width:100%">
                  <span style="font-size:24px;font-weight:900;color:#059669">${recentFormLabel}</span>
                  <span style="font-size:12px;font-weight:600;color:rgba(0,0,0,0.5)">${recap.recentForm.goalsFor} GP / ${recap.recentForm.goalsAgainst} GC</span>
                </div>
              </div>

              <!-- Top Scorer Tile -->
              <div style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.05);padding:16px 20px;border-radius:18px;display:flex;flex-direction:column;gap:4px">
                <div style="font-size:11px;font-weight:700;color:rgba(0,0,0,0.4);letter-spacing:0.05em;text-transform:uppercase">Destaque do Time</div>
                <div style="font-size:20px;font-weight:900;color:#d97706">
                  ⚽ ${esc(cut(topScorerText, 40))}
                </div>
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
