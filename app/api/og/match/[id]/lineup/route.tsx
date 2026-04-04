import { prisma } from "@/lib/prisma";
import { buildMatchLineupSnapshot } from "@/lib/match-lineup";
import { buildLineupFieldPlacements } from "@/lib/lineup-field";
import { safeHex, OG_CACHE_HEADERS } from "../../../route-utils";
import { renderHtmlToImage } from "../../../html-renderer";
import { esc } from "../../../html-templates";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const match = await prisma.match.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      opponent: true,
      status: true,
      lineupFormation: true,
      lineupBlockPreset: true,
      team: {
        select: {
          name: true,
          primaryColor: true,
          secondaryColor: true,
        },
      },
      positionLimits: {
        select: {
          position: true,
          maxPlayers: true,
        },
      },
      rsvps: {
        select: {
          status: true,
          player: {
            select: {
              id: true,
              name: true,
              position: true,
              shirtNumber: true,
              status: true,
              createdAt: true,
            },
          },
        },
      },
      lineupSelections: {
        orderBy: [{ role: "asc" }, { sortOrder: "asc" }],
        select: {
          role: true,
          sortOrder: true,
          fieldX: true,
          fieldY: true,
          updatedAt: true,
          player: {
            select: {
              id: true,
              name: true,
              position: true,
            },
          },
        },
      },
    },
  });

  if (!match || match.status !== "SCHEDULED") {
    return new Response("Not found", { status: 404 });
  }

  const snapshot = buildMatchLineupSnapshot({
    matchId: match.id,
    confirmedPlayers: match.rsvps.map((rsvp) => ({
      playerId: rsvp.player.id,
      playerName: rsvp.player.name,
      position: rsvp.player.position,
      shirtNumber: rsvp.player.shirtNumber,
      createdAt: rsvp.player.createdAt,
      status: rsvp.player.status,
      rsvpStatus: rsvp.status,
    })),
    positionLimits: match.positionLimits.map((limit) => ({
      position: limit.position,
      maxPlayers: limit.maxPlayers,
    })),
    savedSelections: match.lineupSelections.map((selection) => ({
      role: selection.role,
      sortOrder: selection.sortOrder,
      fieldX: selection.fieldX,
      fieldY: selection.fieldY,
      updatedAt: selection.updatedAt,
      player: selection.player,
    })),
    savedFormation: match.lineupFormation,
    savedBlockPreset: match.lineupBlockPreset,
  });

  const placements = buildLineupFieldPlacements(snapshot.lineup.starters);
  const primaryColor = safeHex(match.team.primaryColor, "#1d7a61");
  const secondaryColor = safeHex(match.team.secondaryColor, "#0f172a");
  const dateStr = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(match.date);

  const sourceLabel = snapshot.lineup.meta.source === "SAVED" ? "Escalacao manual salva" : "Escalacao sugerida";

  const alertsHtml = snapshot.lineup.alerts
    .slice(0, 2)
    .map(
      (alert) =>
        `<div style="font-size:13px;line-height:1.35;padding:8px 12px;border-radius:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08)">${esc(alert)}</div>`
    )
    .join("");

  const playersHtml = placements
    .map(
      (p) => `
      <div style="position:absolute;left:${p.y}%;top:${p.x}%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:6px;width:120px">
        <div style="width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${primaryColor};color:white;font-size:17px;font-weight:900;border:3px solid rgba(255,255,255,0.9);box-shadow:0 0 24px ${primaryColor}88,0 8px 20px rgba(0,0,0,0.4)">${esc(p.shortLabel)}</div>
        <div style="text-align:center;font-size:14px;font-weight:700;line-height:1.15;text-shadow:0 2px 12px rgba(0,0,0,0.7);letter-spacing:0.01em">${esc(p.playerName)}</div>
      </div>`
    )
    .join("");

  const LINE = "3px solid rgba(255,255,255,0.5)";

  const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1200px; height:630px; overflow:hidden; font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased; color:white; }
  body { background:#060e0b; display:flex; }
  .sidebar {
    width:360px; display:flex; flex-direction:column; justify-content:space-between;
    padding:36px 30px;
    background:linear-gradient(160deg, ${primaryColor} 0%, ${secondaryColor} 100%);
    position:relative; overflow:hidden;
  }
  .sidebar::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,0,0,0.2) 100%);
  }
  .sidebar::after {
    content:''; position:absolute; inset:0; pointer-events:none; opacity:0.025;
    background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  }
  .field {
    flex:1; position:relative; display:flex; align-items:center; justify-content:center;
    background: radial-gradient(ellipse at center, rgba(44,145,98,0.2) 0%, rgba(14,54,38,0.12) 40%, rgba(4,12,9,1) 100%);
  }
  .field::after {
    content:''; position:absolute; inset:0; pointer-events:none; opacity:0.02;
    background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  }
</style>
</head>
<body>
  <div class="sidebar">
    <div style="display:flex;flex-direction:column;gap:10px;position:relative;z-index:1">
      <div style="width:40px;height:3px;border-radius:2px;background:rgba(255,255,255,0.5);margin-bottom:4px"></div>
      <div style="font-size:12px;letter-spacing:0.18em;opacity:0.6;font-weight:600;text-transform:uppercase">Escalação</div>
      <div style="font-size:36px;font-weight:900;line-height:1.05;letter-spacing:-0.02em">${esc(match.team.name)}</div>
      <div style="font-size:22px;font-weight:700;opacity:0.88">vs ${esc(match.opponent)}</div>
      <div style="font-size:15px;opacity:0.6;font-weight:500">${esc(dateStr)}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;position:relative;z-index:1">
      <div style="display:inline-flex;align-items:center;align-self:flex-start;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);border-radius:999px;padding:7px 14px;font-size:13px;font-weight:700">${esc(sourceLabel)}</div>
      <div style="font-size:14px;opacity:0.7;font-weight:500">Titulares: ${snapshot.lineup.meta.startersCount} · Banco: ${snapshot.lineup.meta.benchCount}</div>
      ${alertsHtml}
    </div>
  </div>
  <div class="field">
    <!-- Field markings -->
    <div style="position:absolute;inset:32px;border-radius:24px;border:${LINE}"></div>
    <div style="position:absolute;left:50%;top:64px;bottom:64px;width:3px;background:rgba(255,255,255,0.5);transform:translateX(-50%)"></div>
    <div style="position:absolute;left:50%;top:50%;width:160px;height:160px;border-radius:50%;border:${LINE};transform:translate(-50%,-50%)"></div>
    <!-- Left penalty area -->
    <div style="position:absolute;left:32px;top:145px;width:110px;height:340px;border-top:${LINE};border-right:${LINE};border-bottom:${LINE};border-left:none;border-top-right-radius:22px;border-bottom-right-radius:22px"></div>
    <div style="position:absolute;left:32px;top:225px;width:38px;height:180px;border-top:${LINE};border-right:${LINE};border-bottom:${LINE};border-left:none;border-top-right-radius:16px;border-bottom-right-radius:16px"></div>
    <!-- Right penalty area -->
    <div style="position:absolute;right:32px;top:145px;width:110px;height:340px;border-top:${LINE};border-left:${LINE};border-bottom:${LINE};border-right:none;border-top-left-radius:22px;border-bottom-left-radius:22px"></div>
    <div style="position:absolute;right:32px;top:225px;width:38px;height:180px;border-top:${LINE};border-left:${LINE};border-bottom:${LINE};border-right:none;border-top-left-radius:16px;border-bottom-left-radius:16px"></div>
    <!-- Center & penalty spots -->
    <div style="position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.6);transform:translate(-50%,-50%)"></div>
    <div style="position:absolute;left:125px;top:50%;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.5);transform:translate(-50%,-50%)"></div>
    <div style="position:absolute;right:125px;top:50%;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.5);transform:translate(50%,-50%)"></div>
    <!-- Players -->
    ${playersHtml}
  </div>
</body>
</html>`;

  const png = await renderHtmlToImage(html, { width: 1200, height: 630 });
  return new Response(png, { headers: { "Content-Type": "image/png", ...OG_CACHE_HEADERS } });
}