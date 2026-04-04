import { prisma } from "@/lib/prisma";
import { safeHex, OG_CACHE_HEADERS, resolveFormat, OG_DIMENSIONS } from "../../route-utils";
import { resolveTheme } from "../../themes";
import { renderHtmlToImage } from "../../html-renderer";
import { baseLayout, esc, cut, resolveAssetUrl } from "../../html-templates";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function badgeHtml(url: string | null, name: string): string {
  return url
    ? `<img src="${esc(url)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:contain;padding:8%">`
    : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:52px;font-weight:900">${esc(name.slice(0, 2).toUpperCase())}</div>`;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const format = resolveFormat(searchParams.get("format"));
  const theme = resolveTheme(searchParams.get("theme"));
  const dims = OG_DIMENSIONS[format];

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      team: {
        select: {
          name: true,
          shortName: true,
          primaryColor: true,
          secondaryColor: true,
          badgeUrl: true,
        },
      },
      matchStats: {
        where: { goals: { gt: 0 } },
        include: { player: { select: { name: true } } },
        orderBy: { goals: "desc" },
        take: 3,
      },
    },
  });

  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  const primaryColor = safeHex(match.team.primaryColor, "#1e40af");
  const secondaryColor = safeHex(match.team.secondaryColor, "#0f172a");
  const teamBadgeUrl = resolveAssetUrl(match.team.badgeUrl, request.url);
  const opponentBadgeUrl = resolveAssetUrl(match.opponentBadgeUrl, request.url);
  const teamLabel = match.team.shortName || cut(match.team.name, 16);
  const opponentLabel = cut(match.opponent, 16);
  const homeName = match.isHome ? teamLabel : opponentLabel;
  const awayName = match.isHome ? opponentLabel : teamLabel;
  const homeBadge = match.isHome ? teamBadgeUrl : opponentBadgeUrl;
  const awayBadge = match.isHome ? opponentBadgeUrl : teamBadgeUrl;
  const isCompleted = match.status === "COMPLETED" && match.homeScore !== null && match.awayScore !== null;

  const home = match.homeScore ?? "-";
  const away = match.awayScore ?? "-";
  const teamGoals = match.isHome ? match.homeScore : match.awayScore;
  const opponentGoals = match.isHome ? match.awayScore : match.homeScore;

  const resultLabel =
    typeof teamGoals === "number" && typeof opponentGoals === "number"
      ? teamGoals > opponentGoals ? "VITORIA" : teamGoals < opponentGoals ? "DERROTA" : "EMPATE"
      : "PRE-JOGO";
  const resultClass =
    resultLabel === "VITORIA" ? "win"
      : resultLabel === "DERROTA" ? "loss"
        : resultLabel === "EMPATE" ? "draw"
          : "draw";

  const scorers = match.matchStats.map((s) => `${s.player.name} (${s.goals})`).join("  ·  ");
  const dateStr = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(match.date);

  const content = `
    <div class="card card-padded" style="padding:28px 34px;gap:0">
      <div class="glow-line"></div>

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0">
          <div class="tracking-wide text-muted" style="font-size:13px;font-weight:600">${isCompleted ? "MATCHDAY RESULT" : "MATCHDAY PREVIEW"}</div>
          <div class="font-black" style="font-size:48px;line-height:1;letter-spacing:-0.02em">${esc(teamLabel)} vs ${esc(cut(match.opponent, 18))}</div>
        </div>
        <div class="result-pill-${resultClass} pill" style="font-size:14px;font-weight:800;padding:10px 20px;letter-spacing:0.06em;margin-top:4px">
          ${isCompleted ? esc(resultLabel) : "PRÉ-JOGO"}
        </div>
      </div>

      <!-- Scoreboard -->
      <div style="display:flex;align-items:center;justify-content:center;flex:1;gap:0;margin:16px 0 12px">
        <!-- Home side -->
        <div style="display:flex;flex-direction:column;align-items:center;width:38%;gap:12px">
          <div class="badge badge-xl">${badgeHtml(homeBadge, homeName)}</div>
          <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.85;text-align:center;line-height:1.2">${esc(homeName)}</div>
          <div class="mono font-black tabular" style="font-size:128px;line-height:0.85;text-shadow:0 8px 40px rgba(0,0,0,0.5)">${home}</div>
        </div>

        <!-- Separator -->
        <div style="display:flex;flex-direction:column;align-items:center;width:24%;gap:8px">
          <div style="width:1px;height:40px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)"></div>
          <div style="width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);font-size:22px;font-weight:800;opacity:0.5">×</div>
          <div style="width:1px;height:40px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)"></div>
        </div>

        <!-- Away side -->
        <div style="display:flex;flex-direction:column;align-items:center;width:38%;gap:12px">
          <div class="badge badge-xl">${badgeHtml(awayBadge, awayName)}</div>
          <div style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;opacity:0.85;text-align:center;line-height:1.2">${esc(awayName)}</div>
          <div class="mono font-black tabular" style="font-size:128px;line-height:0.85;text-shadow:0 8px 40px rgba(0,0,0,0.5)">${away}</div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Footer info + scorers -->
      <div style="display:flex;gap:10px;margin-top:10px;align-items:center">
        <span class="pill" style="font-size:14px;font-weight:600">${esc(cut(match.venue, 30))}</span>
        <span class="pill" style="font-size:14px;font-weight:600">${esc(dateStr)}</span>
        <span class="pill" style="font-size:14px;font-weight:600">${match.isHome ? "Mandante" : "Visitante"}</span>
        ${isCompleted && scorers.length > 0 ? `<span class="text-muted" style="font-size:14px;margin-left:auto">⚽ ${esc(cut(scorers, 60))}</span>` : ""}
      </div>
    </div>
  `;

  const html = baseLayout({ width: dims.width, height: dims.height, theme, primary: primaryColor, secondary: secondaryColor, content });
  const png = await renderHtmlToImage(html, dims);
  return new Response(png, { headers: { "Content-Type": "image/png", ...OG_CACHE_HEADERS } });
}
