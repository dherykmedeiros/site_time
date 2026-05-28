import { prisma } from "@/lib/prisma";
import { safeHex, OG_CACHE_HEADERS, resolveFormat, OG_DIMENSIONS } from "../../route-utils";
import { resolveTheme } from "../../themes";
import { renderHtmlToImage } from "../../html-renderer";
import { baseLayout, esc, cut, resolveAssetUrl } from "../../html-templates";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ eventId: string }>;
}

function fallbackSvg(width: number, height: number): Response {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0b0f19"/>
  <text x="${width / 2}" y="${height / 2}" fill="#e2e8f0" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="700">Recap indisponível</text>
</svg>`;
  return new Response(svg.trim(), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=60" },
  });
}

export async function GET(request: Request, context: RouteContext) {
  const { eventId } = await context.params;
  const { searchParams } = new URL(request.url);
  const theme = resolveTheme(searchParams.get("theme"));
  const dims = OG_DIMENSIONS.stories; // Story-format stories (1080x1920) as requested

  try {
    const event = await prisma.matchLiveEvent.findUnique({
      where: { id: eventId },
      include: {
        player: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            shirtNumber: true,
            position: true,
          }
        },
        guestPlayer: {
          select: {
            id: true,
            name: true,
            shirtNumber: true,
            position: true,
          }
        },
        matchLive: {
          include: {
            match: {
              include: {
                team: {
                  select: {
                    id: true,
                    name: true,
                    shortName: true,
                    badgeUrl: true,
                    primaryColor: true,
                    secondaryColor: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!event) {
      return new Response("Event not found", { status: 404 });
    }

    // Verify it is an event from OUR team
    const isOurTeamEvent = event.playerId || event.guestPlayerId;
    if (!isOurTeamEvent) {
      return new Response("Opponent events are generic and do not support stories recaps", { status: 400 });
    }

    const match = event.matchLive.match;
    const team = match.team;

    const primary = safeHex(team.primaryColor, "#1d7a61");
    const secondary = safeHex(team.secondaryColor, "#0f172a");

    const playerName = event.player?.name || event.guestPlayer?.name || "Jogador do Time";
    const shirtNumber = event.player?.shirtNumber || event.guestPlayer?.shirtNumber || null;
    const minute = event.minute;
    const half = event.half;
    const description = event.description;

    const formattedTime = `${minute}' (${half}º Tempo)`;

    const homeScore = event.matchLive.homeScore;
    const awayScore = event.matchLive.awayScore;

    const scoreLabel = match.isHome
      ? `${team.shortName || cut(team.name, 12)} ${homeScore} x ${awayScore} ${cut(match.opponent, 12)}`
      : `${cut(match.opponent, 12)} ${homeScore} x ${awayScore} ${team.shortName || cut(team.name, 12)}`;

    const photoUrl =
      resolveAssetUrl(event.player?.photoUrl, request.url) ||
      resolveAssetUrl(team.badgeUrl, request.url);

    const isFallbackBadge = !event.player?.photoUrl;

    // Adapt visual indicators based on event type
    let emoji = "📢";
    let typeLabel = "ACONTECIMENTO!";
    let typeStyle = "background:rgba(255,255,255,0.06); border:2px solid rgba(255,255,255,0.15); color:#fff; box-shadow:0 0 30px rgba(255,255,255,0.05)";
    let subtitleText = "AÇÃO DA PARTIDA";

    if (event.type === "GOAL") {
      emoji = "⚽";
      typeLabel = "GOL DO TIME!";
      typeStyle = `background:rgba(52,211,153,0.1); border:2px solid rgba(52,211,153,0.3); color:#34d399; box-shadow:0 0 30px rgba(52,211,153,0.2)`;
      subtitleText = "AUTOR DO GOL";
    } else if (event.type === "ASSIST") {
      emoji = "👟";
      typeLabel = "ASSISTÊNCIA!";
      typeStyle = `background:rgba(59,130,246,0.1); border:2px solid rgba(59,130,246,0.3); color:#60a5fa; box-shadow:0 0 30px rgba(59,130,246,0.2)`;
      subtitleText = "PÓS-PASSE DECISIVO";
    } else if (event.type === "YELLOW_CARD") {
      emoji = "🟨";
      typeLabel = "CARTÃO AMARELO";
      typeStyle = `background:rgba(245,158,11,0.1); border:2px solid rgba(245,158,11,0.3); color:#fbbf24; box-shadow:0 0 30px rgba(245,158,11,0.15)`;
      subtitleText = "ADVERTÊNCIA DO JOGO";
    } else if (event.type === "RED_CARD") {
      emoji = "🟥";
      typeLabel = "CARTÃO VERMELHO";
      typeStyle = `background:rgba(239,68,68,0.1); border:2px solid rgba(239,68,68,0.3); color:#f87171; box-shadow:0 0 30px rgba(239,68,68,0.2)`;
      subtitleText = "EXPULSÃO EM CAMPO";
    } else if (event.type === "SUBSTITUTION") {
      emoji = "🔁";
      typeLabel = "SUBSTITUIÇÃO";
      typeStyle = `background:rgba(139,92,246,0.1); border:2px solid rgba(139,92,246,0.3); color:#a78bfa; box-shadow:0 0 30px rgba(139,92,246,0.2)`;
      subtitleText = "SAINDO DE CAMPO";
    }

    const content = `
      <div class="card" style="overflow:hidden;gap:0;background:#060a13;border-color:rgba(255,255,255,0.06);display:flex;flex-direction:column;justify-content:flex-start;height:100%;padding:0;">
        <!-- Banner or Crest Section -->
        <div style="position:relative;width:100%;height:52%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, ${primary}55 0%, #060a13 100%);overflow:hidden">
          
          <!-- Large floating icon in background -->
          <div style="position:absolute;font-size:260px;opacity:0.07;top:10%;left:25%;pointer-events:none;color:#fff;">${emoji}</div>

          <!-- Photo or Badge -->
          <div style="width:380px;height:380px;border-radius:50%;overflow:hidden;border:5px solid rgba(255,255,255,0.18);box-shadow:0 30px 80px rgba(0,0,0,0.6), 0 0 100px ${primary}44;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.02)">
            ${photoHtml(photoUrl, playerName, true, isFallbackBadge)}
          </div>
          
          <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,#060a13 100%)"></div>
        </div>

        <div style="display:flex;flex-direction:column;padding:40px 48px;flex:1;justify-content:flex-start;gap:24px;text-align:center;align-items:center;">
          
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
            <!-- Event Type Pill -->
            <div style="display:flex;align-items:center;gap:12px;border-radius:99px;padding:8px 24px;${typeStyle}">
              <span style="font-size:32px">${emoji}</span>
              <span class="tracking-wide" style="font-size:26px;font-weight:900;letter-spacing:0.25em">${typeLabel}</span>
            </div>

            <!-- Role Indicator Subtitle -->
            <span class="tracking-wide" style="font-size:15px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:0.18em;margin-top:20px;text-transform:uppercase;">${subtitleText}</span>

            <!-- Player name and shirt number -->
            <h1 class="font-black" style="font-size:72px;line-height:1.05;letter-spacing:-0.03em;color:white;margin-top:6px;text-transform:uppercase;text-shadow:0 8px 24px rgba(0,0,0,0.5)">
              ${esc(cut(playerName, 26))}
              ${shirtNumber ? `<span style="font-size:48px;color:${primary};font-family:'Roboto Mono',monospace;margin-left:8px;font-weight:900;">#${shirtNumber}</span>` : ""}
            </h1>

            <!-- Time indicator -->
            <div class="pill" style="font-size:26px;font-weight:800;padding:12px 28px;background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.12);color:#e2e8f0;margin-top:16px;font-family:'Roboto Mono',monospace;letter-spacing:0.02em">
               🕒 ${esc(formattedTime)}
            </div>
          </div>

          <!-- Score Card -->
          <div style="width:100%;margin-top:auto;background:rgba(255,255,255,0.03);border:1.5px solid rgba(255,255,255,0.06);border-radius:24px;padding:28px;display:flex;flex-direction:column;gap:8px;align-items:center;justify-content:center;box-shadow:0 12px 36px rgba(0,0,0,0.3)">
            <span class="tracking-wide" style="font-size:16px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:0.2em">PLACAR DO JOGO</span>
            <span style="font-size:32px;font-weight:900;color:#fff;letter-spacing:-0.01em">${esc(scoreLabel)}</span>
          </div>

          <!-- Description / Commentary or entering player detail for Substitutions -->
          ${description ? `
            <div style="margin-top:20px;max-width:90%">
              <p style="font-size:26px;color:#fff;font-weight:700;line-height:1.4">
                "${esc(cut(description, 120))}"
              </p>
            </div>
          ` : ""}

          <!-- Footer brand -->
          <div style="display:flex;align-items:center;gap:12px;margin-top:32px;opacity:0.7">
            ${team.badgeUrl ? `<img src="${esc(resolveAssetUrl(team.badgeUrl, request.url) || "")}" style="width:40px;height:40px;object-fit:cover;border-radius:8px">` : ""}
            <span style="font-size:18px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.05em">${esc(team.name)}</span>
          </div>

        </div>
      </div>
    `;

    function photoHtml(url: string | null, name: string, large: boolean, isFallbackBadge: boolean = false): string {
      if (!url) {
        return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:${large ? 120 : 64}px;font-weight:800;opacity:0.86;color:var(--text-muted)">${esc(name.slice(0, 2).toUpperCase())}</div>`;
      }
      if (isFallbackBadge) {
        return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:radial-gradient(circle, #252e48 0%, #111625 100%);padding:${large ? "60px" : "30px"}">
          <img src="${esc(url)}" alt="${esc(name)}" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 16px 32px rgba(0,0,0,0.5))">
        </div>`;
      }
      return `<img src="${esc(url)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:cover">`;
    }

    const html = baseLayout({
      width: dims.width,
      height: dims.height,
      theme,
      primary,
      secondary,
      content,
      extraCss: `
        body {
          background: #03060c;
        }
      `
    });

    const png = await renderHtmlToImage(html, dims);
    return new Response(png, { headers: { "Content-Type": "image/png", ...OG_CACHE_HEADERS } });
  } catch (e) {
    console.error("Error generating event recap:", e);
    return fallbackSvg(dims.width, dims.height);
  }
}
