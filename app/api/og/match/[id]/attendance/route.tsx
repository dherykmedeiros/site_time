import { prisma } from "@/lib/prisma";
import { safeHex, OG_CACHE_HEADERS, resolveFormat, OG_DIMENSIONS } from "../../../route-utils";
import { resolveTheme } from "../../../themes";
import { renderHtmlToImage } from "../../../html-renderer";
import { baseLayout, esc, cut, resolveAssetUrl } from "../../../html-templates";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const format = resolveFormat(searchParams.get("format"));
  const theme = resolveTheme("dark");
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
    },
  });

  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  // Query only present check-ins
  const attendances = await prisma.matchAttendance.findMany({
    where: {
      matchId: id,
      present: true,
    },
    include: {
      player: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      checkedInAt: "asc",
    },
  });

  const primaryColor = safeHex(match.team.primaryColor, "#1e40af");
  const secondaryColor = safeHex(match.team.secondaryColor, "#0f172a");
  const teamLabel = match.team.shortName || cut(match.team.name, 16);
  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(match.date);

  // Dynamic layout adjustments based on number of players
  const useFourColumns = attendances.length > 15;
  const colWidth = useFourColumns ? "22.5%" : "30.5%";
  const padding = useFourColumns ? "8px 12px" : "12px 16px";
  const fontSize = useFourColumns ? "14px" : "16px";
  const timeFontSize = useFourColumns ? "12px" : "14px";
  const gap = useFourColumns ? "12px 16px" : "16px 24px";

  const content = `
    <div class="card card-padded" style="padding:28px 34px;gap:0;display:flex;flex-direction:column;justify-content:space-between">
      <div class="glow-line"></div>

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0">
          <div class="tracking-wide text-muted" style="font-size:13px;font-weight:600">RELATÓRIO DE PRESENÇA (CHECK-IN)</div>
          <div class="font-black" style="font-size:42px;line-height:1;letter-spacing:-0.02em;color:white">${esc(teamLabel)} vs ${esc(cut(match.opponent, 18))}</div>
        </div>
        <div class="result-pill-win pill" style="font-size:14px;font-weight:800;padding:10px 20px;letter-spacing:0.06em;margin-top:4px">
          ${attendances.length} CONFIRMADOS
        </div>
      </div>

      <!-- List of Checked-in Players -->
      <div style="display:flex;flex-wrap:wrap;gap:${gap};flex:1;margin:24px 0 16px;align-content:flex-start;overflow:hidden">
        ${attendances.length === 0 ? `
          <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:18px;font-weight:600;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.05em">
            Nenhum check-in de presença realizado ainda
          </div>
        ` : attendances.map((att) => {
          const checkedInTimeStr = att.checkedInAt
            ? new Intl.DateTimeFormat("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/Sao_Paulo",
              }).format(att.checkedInAt)
            : "--:--";

          return `
            <div style="display:flex;align-items:center;justify-content:space-between;width:${colWidth};background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:${padding};box-sizing:border-box">
              <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
                <span style="font-size:${fontSize}">👤</span>
                <span class="font-bold" style="font-size:${fontSize};color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(cut(att.player?.name || "Jogador", 16))}</span>
              </div>
              <span class="mono font-bold" style="font-size:${timeFontSize};color:#34d399;margin-left:8px;flex-shrink:0">📍 ${checkedInTimeStr}</span>
            </div>
          `;
        }).join("")}
      </div>

      <div class="divider"></div>

      <!-- Footer Info -->
      <div style="display:flex;gap:10px;margin-top:10px;align-items:center">
        <span class="pill" style="font-size:14px;font-weight:600">${esc(cut(match.venue, 30))}</span>
        <span class="pill" style="font-size:14px;font-weight:600">${esc(dateStr)}</span>
      </div>
    </div>
  `;

  const html = baseLayout({
    width: dims.width,
    height: dims.height,
    theme,
    primary: primaryColor,
    secondary: secondaryColor,
    content,
  });

  const png = await renderHtmlToImage(html, dims);
  return new Response(png, {
    headers: { "Content-Type": "image/png", ...OG_CACHE_HEADERS },
  });
}
