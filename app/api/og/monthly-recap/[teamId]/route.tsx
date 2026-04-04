import { buildPeriodRecap } from "@/lib/period-recap";
import { safeHex, OG_CACHE_HEADERS, resolveFormat, OG_DIMENSIONS } from "../../route-utils";
import { resolveTheme } from "../../themes";
import { trackOperationalEvent } from "@/lib/telemetry";
import { renderHtmlToImage } from "../../html-renderer";
import { baseLayout, esc, cut, resolveAssetUrl } from "../../html-templates";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ teamId: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { teamId } = await context.params;
  const { searchParams } = new URL(request.url);
  const format = resolveFormat(searchParams.get("format"));
  const themeConfig = resolveTheme(searchParams.get("theme"));
  const dims = OG_DIMENSIONS[format];
  const isStories = format === "stories";

  try {
    const recap = await buildPeriodRecap(teamId, 30);
    if (!recap) return new Response("Not found", { status: 404 });

    const badgeUrl = resolveAssetUrl(recap.team.badgeUrl, request.url);

    trackOperationalEvent("recap_monthly_card_viewed", {
      teamId,
      matches: recap.matches,
    });

    const primary = safeHex(recap.team.primaryColor, "#1d7a61");
    const secondary = safeHex(recap.team.secondaryColor, "#0f172a");
    const teamLabel = recap.team.shortName || cut(recap.team.name, 40);
    const topScorerLabel = recap.leaders.topScorer
      ? `${recap.leaders.topScorer.name} (${recap.leaders.topScorer.goals})`
      : "—";
    const sinceLabel = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(recap.period.since);
    const untilLabel = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(recap.period.until);

    const badgeHtml = badgeUrl
      ? `<div class="badge badge-xl"><img src="${esc(badgeUrl)}" alt="${esc(recap.team.name)}" style="width:100%;height:100%;object-fit:contain;padding:8%"></div>`
      : "";

    const content = `
      <div class="card card-padded" style="padding:${isStories ? "30px 28px" : "28px 34px"};gap:0">
        <div class="glow-line"></div>

        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start">
          <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0">
            <div class="tracking-wide text-muted" style="font-size:13px;font-weight:600">RECAP MENSAL</div>
            <div class="font-black" style="font-size:${isStories ? 42 : 52}px;line-height:1;letter-spacing:-0.02em">${esc(teamLabel)}</div>
            <div class="text-muted font-medium" style="font-size:${isStories ? 18 : 20}px;margin-top:2px">${esc(sinceLabel)} — ${esc(untilLabel)} · ${recap.matches} jogo${recap.matches !== 1 ? "s" : ""}</div>
          </div>
          ${badgeHtml}
        </div>

        <!-- Record chips -->
        <div style="display:flex;flex-wrap:${isStories ? "wrap" : "nowrap"};gap:10px;margin-top:16px">
          <div class="record-chip" style="background:rgba(16,185,129,0.18);flex:1">
            <div class="num mono">${recap.record.wins}</div>
            <div class="label">Vitórias</div>
          </div>
          <div class="record-chip" style="background:rgba(100,116,139,0.2);flex:1">
            <div class="num mono">${recap.record.draws}</div>
            <div class="label">Empates</div>
          </div>
          <div class="record-chip" style="background:rgba(239,68,68,0.18);flex:1">
            <div class="num mono">${recap.record.losses}</div>
            <div class="label">Derrotas</div>
          </div>
          <div class="record-chip" style="flex:1">
            <div class="num mono">${recap.goals.scored}:${recap.goals.conceded}</div>
            <div class="label">GP:GC</div>
          </div>
        </div>

        <div class="divider" style="margin:12px 0"></div>

        <!-- Top scorer -->
        <div style="display:flex;gap:10px">
          <div class="stat-tile" style="flex:1">
            <div class="label">Artilheiro do período</div>
            <div class="font-bold" style="font-size:26px;margin-top:2px">${esc(cut(topScorerLabel, 38))}</div>
          </div>
        </div>
      </div>
    `;

    const html = baseLayout({ width: dims.width, height: dims.height, theme: themeConfig, primary, secondary, content });
    const png = await renderHtmlToImage(html, dims);
    return new Response(png, { headers: { "Content-Type": "image/png", ...OG_CACHE_HEADERS } });
  } catch {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dims.width}" height="${dims.height}" viewBox="0 0 ${dims.width} ${dims.height}">
  <rect width="${dims.width}" height="${dims.height}" fill="#0f172a"/>
  <text x="50%" y="50%" fill="#e2e8f0" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" font-size="46" font-weight="700">Recap indisponivel no momento</text>
</svg>`;
    return new Response(svg.trim(), {
      headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=60" },
    });
  }
}
