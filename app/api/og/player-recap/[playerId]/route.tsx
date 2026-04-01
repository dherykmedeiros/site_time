import { ImageResponse } from "next/og";
import { buildPlayerRecap } from "@/lib/player-recap";
import { safeHex } from "../../route-utils";
import { trackOperationalEvent } from "@/lib/telemetry";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ playerId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { playerId } = await context.params;
  const recap = await buildPlayerRecap(playerId);

  if (!recap) {
    return new Response("Not found", { status: 404 });
  }

  const primary = safeHex(recap.team.primaryColor, "#1d7a61");
  const secondary = safeHex(recap.team.secondaryColor, "#0f172a");
  const recentBadge = recap.lastFive.matches > 0
    ? `${recap.lastFive.goals}G ${recap.lastFive.assists}A nos ultimos ${recap.lastFive.matches}`
    : "Sem partidas recentes";

  trackOperationalEvent("recap_player_card_viewed", {
    playerId,
    teamId: recap.team.id,
    matches: recap.career.matches,
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          color: "white",
          fontFamily: "sans-serif",
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.20), transparent 36%)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "20px", letterSpacing: "0.14em", opacity: 0.78 }}>
              PLAYER RECAP
            </div>
            <div style={{ fontSize: "62px", fontWeight: 900, lineHeight: 1 }}>
              {recap.player.name}
            </div>
            <div style={{ fontSize: "24px", opacity: 0.85 }}>
              {recap.team.name}
            </div>
          </div>

          <div style={{ display: "flex", gap: "18px" }}>
            <div style={{ borderRadius: "18px", background: "rgba(255,255,255,0.12)", padding: "16px 20px" }}>
              <div style={{ fontSize: "14px", opacity: 0.78 }}>Partidas</div>
              <div style={{ fontSize: "34px", fontWeight: 800 }}>{recap.career.matches}</div>
            </div>
            <div style={{ borderRadius: "18px", background: "rgba(255,255,255,0.12)", padding: "16px 20px" }}>
              <div style={{ fontSize: "14px", opacity: 0.78 }}>Gols</div>
              <div style={{ fontSize: "34px", fontWeight: 800 }}>{recap.career.goals}</div>
            </div>
            <div style={{ borderRadius: "18px", background: "rgba(255,255,255,0.12)", padding: "16px 20px" }}>
              <div style={{ fontSize: "14px", opacity: 0.78 }}>Assistencias</div>
              <div style={{ fontSize: "34px", fontWeight: 800 }}>{recap.career.assists}</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "18px", opacity: 0.9 }}>{recentBadge}</div>
            <div style={{ fontSize: "14px", opacity: 0.64 }}>VARzea recap</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
