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

    // Extract scorers for our team
    const teamScorers = (recap.match.matchStats as any[])
      .filter((s: any) => s.goals > 0)
      .map((s: any) => ({
        name: (s.player?.name ?? s.guestPlayer?.name ?? "Convidado") as string,
        goals: s.goals as number,
      }))
      .sort((a: { goals: number }, b: { goals: number }) => b.goals - a.goals);

    const scorersHtml = teamScorers.map((s: { name: string; goals: number }) => `
      <div style="display:flex;align-items:center;gap:12px;font-size:26px;font-weight:900;color:white;text-transform:uppercase;letter-spacing:-0.01em;line-height:1.2;margin-bottom:8px">
        <span style="font-size:24px">⚽</span>
        <span>${esc(cut(s.name, 18))} ${s.goals > 1 ? `(${s.goals}x)` : ''}</span>
      </div>
    `).join("");

    let content: string;
    if (isStories) {
      content = `
        <div class="card" style="margin:0;border-radius:0;border:none;width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:80px 0;background:#0d0d0d;position:relative">
          
          <!-- Atmospheric noise & crumpled overlay -->
          <div style="position:absolute;inset:0;opacity:0.04;background-image:url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.04\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E');mix-blend-mode:overlay;pointer-events:none"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.015) 0%,rgba(0,0,0,0.15) 50%,rgba(255,255,255,0.015) 100%),linear-gradient(220deg,rgba(255,255,255,0.01) 0%,rgba(0,0,0,0.2) 60%,rgba(255,255,255,0.01) 100%);mix-blend-mode:overlay;pointer-events:none"></div>

          <!-- Title: FIM DE JOGO in outline text -->
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:20px;gap:8px;z-index:2">
            <div style="font-family:'Inter',sans-serif;font-size:120px;font-weight:900;color:transparent;-webkit-text-stroke:3.5px white;letter-spacing:0.06em;line-height:0.85;text-align:center;text-transform:uppercase;width:100%">
              FIM DE
            </div>
            <div style="font-family:'Inter',sans-serif;font-size:120px;font-weight:900;color:transparent;-webkit-text-stroke:3.5px white;letter-spacing:0.06em;line-height:0.85;text-align:center;text-transform:uppercase;width:100%">
              JOGO
            </div>
          </div>

          <!-- Scoreboard Section: Badges and Score -->
          <div style="display:flex;flex-direction:column;align-items:center;width:100%;margin-top:-20px;z-index:2">
            <div style="display:flex;align-items:center;justify-content:center;gap:36px;width:100%;padding:0 48px;">
              <!-- Left Team Badge -->
              <div style="display:flex;flex-direction:column;align-items:center;width:28%">
                <div class="badge badge-lg" style="width:160px;height:160px;border:3px solid rgba(255,255,255,0.15);box-shadow:0 16px 40px rgba(0,0,0,0.6)">
                  ${badgeHtml(homeBadge, homeName)}
                </div>
              </div>

              <!-- Score outline centered -->
              <div style="display:flex;align-items:center;justify-content:center;width:44%">
                <div style="font-family:'Roboto Mono',monospace;font-size:160px;font-weight:900;color:transparent;-webkit-text-stroke:4px white;letter-spacing:-0.05em;line-height:0.9;text-align:center;text-shadow:0 8px 32px rgba(0,0,0,0.5)">
                  ${recap.match.homeScore}-${recap.match.awayScore}
                </div>
              </div>

              <!-- Right Team Badge -->
              <div style="display:flex;flex-direction:column;align-items:center;width:28%">
                <div class="badge badge-lg" style="width:160px;height:160px;border:3px solid rgba(255,255,255,0.15);box-shadow:0 16px 40px rgba(0,0,0,0.6)">
                  ${badgeHtml(awayBadge, awayName)}
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Section: Scorers list and Instagram handle -->
          <div style="display:flex;flex-direction:column;width:100%;padding:0 64px 20px;margin-top:auto;position:relative;z-index:2">
            
            <!-- Scorers list aligned to the right, exactly matching user mockup -->
            ${teamScorers.length > 0 ? `
              <div style="display:flex;flex-direction:column;align-items:flex-start;align-self:flex-end;gap:12px;margin-bottom:60px;margin-right:20px;">
                ${scorersHtml}
              </div>
            ` : ''}

            <!-- Instagram footer info -->
            <div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:100%">
              <!-- Instagram logo colorful icon -->
              <div style="display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:14px;background:radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%);box-shadow:0 8px 24px rgba(214,36,159,0.3)">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div style="font-size:32px;font-weight:900;color:white;letter-spacing:0.08em;text-transform:uppercase;margin-top:6px;opacity:0.9">
                @${esc(recap.team.slug.toUpperCase())}FC
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
              <div class="tracking-wide text-muted" style="font-size:13px;font-weight:600">MATCHDAY RECAP</div>
              <div class="font-black" style="font-size:${titleSize}px;line-height:1;letter-spacing:-0.02em">${esc(teamLabel)}</div>
              <div class="text-muted font-medium" style="font-size:${subtitleSize}px;margin-top:2px">vs ${esc(fitTeamName(awayName))}  ·  ${esc(dateLabel)}</div>
            </div>
            <div class="result-pill-${resultClass} pill" style="font-size:14px;font-weight:800;padding:10px 20px;letter-spacing:0.06em;margin-top:4px">
              ${esc(resultLabel)}
            </div>
          </div>

          <!-- Scoreboard -->
          <div style="display:flex;align-items:center;justify-content:center;gap:0;margin:6px 0 2px">
            <!-- Home side -->
            <div style="display:flex;flex-direction:column;align-items:center;width:38%;gap:6px">
              <div class="badge" style="width:110px;height:110px;border-width:3px;box-shadow:0 16px 48px rgba(0,0,0,0.4),0 0 60px ${primary}18">${badgeHtml(homeBadge, homeName)}</div>
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.85;text-align:center;line-height:1.2">${esc(homeDisplayName)}</div>
              <div class="mono font-black tabular" style="font-size:68px;line-height:0.85;text-shadow:0 6px 32px rgba(0,0,0,0.5)">${recap.match.homeScore}</div>
            </div>

            <!-- Separator -->
            <div style="display:flex;flex-direction:column;align-items:center;width:24%;gap:4px">
              <div style="width:1px;height:28px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)"></div>
              <div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);font-size:18px;font-weight:800;opacity:0.5">×</div>
              <div style="width:1px;height:28px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)"></div>
            </div>

            <!-- Away side -->
            <div style="display:flex;flex-direction:column;align-items:center;width:38%;gap:6px">
              <div class="badge" style="width:110px;height:110px;border-width:3px;box-shadow:0 16px 48px rgba(0,0,0,0.4),0 0 60px ${primary}18">${badgeHtml(awayBadge, awayName)}</div>
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.85;text-align:center;line-height:1.2">${esc(awayDisplayName)}</div>
              <div class="mono font-black tabular" style="font-size:68px;line-height:0.85;text-shadow:0 6px 32px rgba(0,0,0,0.5)">${recap.match.awayScore}</div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Stats row + leaders -->
          <div style="display:flex;gap:8px;margin-top:8px">
            <div class="stat-tile" style="flex:1;padding:12px 14px">
              <div class="label">Artilheiro</div>
              <div class="font-bold" style="font-size:20px;margin-top:2px">${esc(cut(topScorerLabel, 28))}</div>
            </div>
            <div class="stat-tile" style="flex:1;padding:12px 14px">
              <div class="label">Assistências</div>
              <div class="font-bold" style="font-size:20px;margin-top:2px">${esc(cut(topAssistantLabel, 28))}</div>
            </div>
            ${stats.map((s) => `
              <div class="stat-tile" style="width:92px;flex-shrink:0;padding:12px 14px">
                <div class="label">${esc(s.label)}</div>
                <div class="font-extrabold mono" style="font-size:26px;margin-top:2px">${s.value}</div>
              </div>
            `).join("")}
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
    const stack = error instanceof Error ? error.stack : "";
    console.error(`[og/team-recap] matchId=${matchId} error=${message}`, stack);
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
  <text x="600" y="350" fill="#94a3b8" text-anchor="middle" font-family="Arial, sans-serif" font-size="30">
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
