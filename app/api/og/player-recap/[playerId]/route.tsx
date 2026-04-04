import { buildPlayerRecap, buildPlayerMatchRecap } from "@/lib/player-recap";
import { safeHex, OG_CACHE_HEADERS, resolveFormat, OG_DIMENSIONS } from "../../route-utils";
import { resolveTheme } from "../../themes";
import { trackOperationalEvent } from "@/lib/telemetry";
import { renderHtmlToImage } from "../../html-renderer";
import { baseLayout, esc, cut, resolveAssetUrl } from "../../html-templates";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ playerId: string }>;
}

function photoHtml(url: string | null, name: string, large: boolean): string {
  return url
    ? `<img src="${esc(url)}" alt="${esc(name)}" style="width:100%;height:100%;object-fit:cover">`
    : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:${large ? 120 : 64}px;font-weight:800;opacity:0.86;color:var(--text-muted)">${esc(name.slice(0, 2).toUpperCase())}</div>`;
}

function metricsHtml(metrics: { label: string; value: number }[], sizeClass: "lg" | "sm"): string {
  const width = sizeClass === "lg" ? "46%" : "auto";
  const flex = sizeClass === "lg" ? "" : "flex:1;";
  return metrics
    .map(
      (m) => `
      <div class="stat-tile" style="width:${width};${flex}">
        <div class="label">${esc(m.label)}</div>
        <div class="value mono">${m.value}</div>
      </div>`
    )
    .join("");
}

function fallbackSvg(width: number, height: number): Response {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0f172a"/>
  <text x="${width / 2}" y="${height / 2}" fill="#e2e8f0" text-anchor="middle" font-family="Arial,sans-serif" font-size="42" font-weight="700">Recap indisponivel no momento</text>
</svg>`;
  return new Response(svg.trim(), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=60" },
  });
}

export async function GET(request: Request, context: RouteContext) {
  const { playerId } = await context.params;
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");
  const format = resolveFormat(searchParams.get("format"));
  const theme = resolveTheme(searchParams.get("theme"));
  const dims = OG_DIMENSIONS[format];
  const isStories = format === "stories";

  try {
    // ── Match-scoped recap ──
    if (matchId) {
      const matchRecap = await buildPlayerMatchRecap(playerId, matchId);
      if (!matchRecap) return new Response("Not found", { status: 404 });

      const primary = safeHex(matchRecap.team.primaryColor, "#1d7a61");
      const secondary = safeHex(matchRecap.team.secondaryColor, "#0f172a");
      const teamLabel = matchRecap.team.shortName || cut(matchRecap.team.name, 40);
      const dateLabel = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(matchRecap.match.date);
      const scoreLabel = matchRecap.match.isHome
        ? `${matchRecap.match.homeScore ?? 0} x ${matchRecap.match.awayScore ?? 0}`
        : `${matchRecap.match.awayScore ?? 0} x ${matchRecap.match.homeScore ?? 0}`;
      const presenceLabel = matchRecap.present != null ? (matchRecap.present ? "Presente" : "Ausente") : null;
      const photoUrl =
        resolveAssetUrl(matchRecap.player.photoUrl, request.url) ||
        resolveAssetUrl(matchRecap.team.badgeUrl, request.url);

      trackOperationalEvent("recap_player_match_card_viewed", { playerId, matchId, teamId: matchRecap.team.id });

      const metrics = [
        { label: "Gols", value: matchRecap.stats.goals },
        { label: "Assist.", value: matchRecap.stats.assists },
        { label: "C. Amarelos", value: matchRecap.stats.yellowCards },
        { label: "C. Vermelhos", value: matchRecap.stats.redCards },
      ];

      const presenceHtml = presenceLabel
        ? `<span class="pill" style="font-size:${isStories ? 18 : 16}px;font-weight:600;background:${matchRecap.present ? "rgba(16,185,129,0.22)" : "rgba(239,68,68,0.22)"};border-color:${matchRecap.present ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}">${esc(presenceLabel)}</span>`
        : "";

      const infoRow = `
        <div style="display:flex;margin-top:6px;gap:10px;font-size:20px;align-items:center">
          <span class="pill" style="font-weight:700;font-size:${isStories ? 20 : 18}px">${esc(scoreLabel)}</span>
          <span class="text-muted" style="font-size:${isStories ? 20 : 18}px">${esc(dateLabel)}</span>
          ${presenceHtml}
        </div>`;

      let content: string;
      if (isStories) {
        content = `
          <div class="card" style="overflow:hidden;gap:0">
            <!-- Photo with gradient overlay -->
            <div style="position:relative;width:100%;height:42%;display:flex;align-items:center;justify-content:center;background:var(--accent);overflow:hidden">
              ${photoHtml(photoUrl, matchRecap.player.name, true)}
              <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,var(--card-bg) 100%)"></div>
            </div>
            <div style="display:flex;flex-direction:column;padding:30px 36px;flex:1;justify-content:space-between;gap:8px">
              <div style="display:flex;flex-direction:column;gap:6px">
                <div class="glow-line" style="position:static;width:48px;height:3px;border-radius:2px;margin-bottom:4px"></div>
                <div class="tracking-wide text-muted" style="font-size:18px;font-weight:600">MATCH RECAP</div>
                <div class="font-black" style="font-size:56px;line-height:1;letter-spacing:-0.02em">${esc(cut(matchRecap.player.name, 26))}</div>
                <div class="text-muted font-medium" style="font-size:26px">${esc(teamLabel)} vs ${esc(cut(matchRecap.match.opponent, 24))}</div>
                ${infoRow}
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:12px">${metricsHtml(metrics, "lg")}</div>
            </div>
          </div>`;
      } else {
        content = `
          <div class="card card-padded" style="padding:32px 36px;flex-direction:row;justify-content:space-between;align-items:stretch;gap:28px">
            <div style="display:flex;flex-direction:column;flex:1;justify-content:space-between;min-width:0">
              <div style="display:flex;flex-direction:column;gap:6px">
                <div class="glow-line" style="position:static;width:48px;height:3px;border-radius:2px;margin-bottom:4px"></div>
                <div class="tracking-wide text-muted" style="font-size:16px;font-weight:600">MATCH RECAP</div>
                <div class="font-black" style="font-size:56px;line-height:1;letter-spacing:-0.02em">${esc(cut(matchRecap.player.name, 26))}</div>
                <div class="text-muted font-medium" style="font-size:24px">${esc(teamLabel)} vs ${esc(cut(matchRecap.match.opponent, 24))}</div>
                ${infoRow}
              </div>
              <div class="divider" style="margin:8px 0"></div>
              <div style="display:flex;gap:10px">${metricsHtml(metrics, "sm")}</div>
            </div>
            <div style="display:flex;width:260px;flex-shrink:0;border-radius:24px;align-items:center;justify-content:center;background:var(--accent);overflow:hidden;position:relative">
              ${photoHtml(photoUrl, matchRecap.player.name, false)}
              <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.4) 100%)"></div>
            </div>
          </div>`;
      }

      const html = baseLayout({ width: dims.width, height: dims.height, theme, primary, secondary, content });
      const png = await renderHtmlToImage(html, dims);
      return new Response(png, { headers: { "Content-Type": "image/png", ...OG_CACHE_HEADERS } });
    }

    // ── Career recap ──
    const recap = await buildPlayerRecap(playerId);
    if (!recap) return new Response("Not found", { status: 404 });

    const primary = safeHex(recap.team.primaryColor, "#1d7a61");
    const secondary = safeHex(recap.team.secondaryColor, "#0f172a");
    const recentBadge =
      recap.lastFive.matches > 0
        ? `${recap.lastFive.goals}G ${recap.lastFive.assists}A nos ultimos ${recap.lastFive.matches}`
        : "Sem partidas recentes";
    const attendanceLabel = recap.attendance.rate != null ? `Presenca: ${recap.attendance.rate}%` : null;
    const teamLabel = recap.team.shortName || cut(recap.team.name, 40);

    trackOperationalEvent("recap_player_card_viewed", { playerId, teamId: recap.team.id, matches: recap.career.matches });

    const photoUrl =
      resolveAssetUrl(recap.player.photoUrl, request.url) ||
      resolveAssetUrl(recap.team.badgeUrl, request.url);

    const careerMetrics = [
      { label: "Partidas", value: recap.career.matches },
      { label: "Gols", value: recap.career.goals },
      { label: "Assist.", value: recap.career.assists },
      { label: "C. Amarelos", value: recap.career.yellowCards },
      { label: "C. Vermelhos", value: recap.career.redCards },
    ];

    const recentRow = `
      <div style="display:flex;margin-top:4px;gap:10px;align-items:center">
        <span class="pill" style="font-size:17px">${esc(cut(recentBadge, 44))}</span>
        ${attendanceLabel ? `<span class="pill" style="font-size:17px">${esc(attendanceLabel)}</span>` : ""}
      </div>`;

    let content: string;
    if (isStories) {
      content = `
        <div class="card" style="overflow:hidden;gap:0">
          <!-- Photo with gradient overlay -->
          <div style="position:relative;width:100%;height:40%;display:flex;align-items:center;justify-content:center;background:var(--accent);overflow:hidden">
            ${photoHtml(photoUrl, recap.player.name, true)}
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,var(--card-bg) 100%)"></div>
          </div>
          <div style="display:flex;flex-direction:column;padding:30px 36px;flex:1;justify-content:space-between;gap:8px">
            <div style="display:flex;flex-direction:column;gap:6px">
              <div class="glow-line" style="position:static;width:48px;height:3px;border-radius:2px;margin-bottom:4px"></div>
              <div class="tracking-wide text-muted" style="font-size:18px;font-weight:600">PLAYER RECAP</div>
              <div class="font-black" style="font-size:56px;line-height:1;letter-spacing:-0.02em">${esc(cut(recap.player.name, 26))}</div>
              <div class="text-muted font-medium" style="font-size:28px">${esc(teamLabel)}</div>
              ${recentRow}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:12px">${metricsHtml(careerMetrics, "lg")}</div>
          </div>
        </div>`;
    } else {
      content = `
        <div class="card card-padded" style="padding:32px 36px;flex-direction:row;justify-content:space-between;align-items:stretch;gap:28px">
          <div style="display:flex;flex-direction:column;flex:1;justify-content:space-between;min-width:0">
            <div style="display:flex;flex-direction:column;gap:6px">
              <div class="glow-line" style="position:static;width:48px;height:3px;border-radius:2px;margin-bottom:4px"></div>
              <div class="tracking-wide text-muted" style="font-size:16px;font-weight:600">PLAYER RECAP</div>
              <div class="font-black" style="font-size:64px;line-height:1;letter-spacing:-0.02em">${esc(cut(recap.player.name, 26))}</div>
              <div class="text-muted font-medium" style="font-size:28px">${esc(teamLabel)}</div>
              ${recentRow}
            </div>
            <div class="divider" style="margin:8px 0"></div>
            <div style="display:flex;gap:10px">${metricsHtml(careerMetrics, "sm")}</div>
          </div>
          <div style="display:flex;width:260px;flex-shrink:0;border-radius:24px;align-items:center;justify-content:center;background:var(--accent);overflow:hidden;position:relative">
            ${photoHtml(photoUrl, recap.player.name, false)}
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.4) 100%)"></div>
          </div>
        </div>`;
    }

    const html = baseLayout({ width: dims.width, height: dims.height, theme, primary, secondary, content });
    const png = await renderHtmlToImage(html, dims);
    return new Response(png, { headers: { "Content-Type": "image/png", ...OG_CACHE_HEADERS } });
  } catch {
    return fallbackSvg(dims.width, dims.height);
  }
}
