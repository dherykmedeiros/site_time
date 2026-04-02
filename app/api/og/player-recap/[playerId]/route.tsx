import { ImageResponse } from "next/og";
import { buildPlayerRecap } from "@/lib/player-recap";
import { safeHex } from "../../route-utils";
import { trackOperationalEvent } from "@/lib/telemetry";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ playerId: string }>;
}

function resolveAssetUrl(path: string | null | undefined, requestUrl: string) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const origin =
    (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "") ||
    new URL(requestUrl).origin;

  if (!path.startsWith("/")) {
    return `${origin}/${path}`;
  }

  return `${origin}${path}`;
}

function cut(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}...`;
}

export async function GET(request: Request, context: RouteContext) {
  const { playerId } = await context.params;

  try {
    const recap = await buildPlayerRecap(playerId);

    if (!recap) {
      return new Response("Not found", { status: 404 });
    }

    const primary = safeHex(recap.team.primaryColor, "#1d7a61");
    const secondary = safeHex(recap.team.secondaryColor, "#0f172a");
    const recentBadge = recap.lastFive.matches > 0
      ? `${recap.lastFive.goals}G ${recap.lastFive.assists}A nos ultimos ${recap.lastFive.matches}`
      : "Sem partidas recentes";
    const teamLabel = recap.team.shortName || cut(recap.team.name, 40);

    trackOperationalEvent("recap_player_card_viewed", {
      playerId,
      teamId: recap.team.id,
      matches: recap.career.matches,
    });

    const photoUrl =
      resolveAssetUrl(recap.player.photoUrl, request.url) ||
      resolveAssetUrl(recap.team.badgeUrl, request.url);

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            position: "relative",
            fontFamily: "Arial, sans-serif",
            color: "white",
            background: `linear-gradient(130deg, ${primary} 0%, ${secondary} 100%)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "0",
              display: "flex",
              background:
                "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.2), transparent 34%), radial-gradient(circle at 82% 0%, rgba(255,255,255,0.14), transparent 36%)",
            }}
          />

          <div
            style={{
              margin: "36px",
              borderRadius: "30px",
              display: "flex",
              width: "calc(100% - 72px)",
              height: "calc(100% - 72px)",
              padding: "40px",
              background: "rgba(0,0,0,0.18)",
              justifyContent: "space-between",
              alignItems: "stretch",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", width: "68%", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", fontSize: "20px", letterSpacing: "0.16em", opacity: 0.84 }}>
                  PLAYER RECAP
                </div>
                <div style={{ display: "flex", fontSize: "72px", fontWeight: 900, lineHeight: 1.02 }}>
                  {cut(recap.player.name, 26)}
                </div>
                <div style={{ display: "flex", fontSize: "32px", opacity: 0.92 }}>
                  {teamLabel}
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "8px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.16)",
                    padding: "10px 16px",
                    fontSize: "19px",
                  }}
                >
                  Ultimos jogos: {cut(recentBadge, 44)}
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                {[
                  { label: "Partidas", value: recap.career.matches },
                  { label: "Gols", value: recap.career.goals },
                  { label: "Assistencias", value: recap.career.assists },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "188px",
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.16)",
                      padding: "16px 18px",
                    }}
                  >
                    <div style={{ display: "flex", fontSize: "19px", opacity: 0.88 }}>{metric.label}</div>
                    <div style={{ display: "flex", marginTop: "8px", fontSize: "58px", fontWeight: 800 }}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                width: "28%",
                borderRadius: "28px",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.14)",
                overflow: "hidden",
              }}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={recap.player.name}
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ display: "flex", fontSize: "64px", fontWeight: 800, opacity: 0.86 }}>
                  {recap.player.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "46px",
            fontWeight: 700,
          }}
        >
          Recap indisponivel no momento
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
