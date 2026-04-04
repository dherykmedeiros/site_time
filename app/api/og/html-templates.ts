import type { ThemeConfig } from "./themes";

/**
 * Resolves a relative or absolute asset path to a full URL.
 * Shared across all OG routes (replaces per-route duplicates).
 */
export function resolveAssetUrl(
  path: string | null | undefined,
  requestUrl: string
): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const origin =
    (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "") ||
    new URL(requestUrl).origin;

  return path.startsWith("/") ? `${origin}${path}` : `${origin}/${path}`;
}

/**
 * Escapes HTML special characters to prevent XSS in templates.
 */
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Truncates a string to `max` characters with ellipsis.
 */
export function cut(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

interface BaseLayoutOpts {
  width: number;
  height: number;
  theme: ThemeConfig;
  primary: string;
  secondary: string;
  content: string;
  /** Extra CSS to inject into the <style> tag */
  extraCss?: string;
}

/**
 * Instagram-quality base layout with:
 * - Inter + Roboto Mono fonts via Google Fonts
 * - Noise grain texture for premium feel
 * - Multi-layer glassmorphism
 * - CSS custom properties from theme
 * - Radial light orbs + pattern overlay
 */
export function baseLayout(opts: BaseLayoutOpts): string {
  const { width, height, theme, primary, secondary, content, extraCss } = opts;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Roboto+Mono:wght@700;900&display=swap" rel="stylesheet">
<style>
  :root {
    --card-bg: ${theme.cardBg};
    --text: ${theme.text};
    --text-muted: ${theme.textMuted};
    --accent: ${theme.accent};
    --border: ${theme.border};
    --primary: ${primary};
    --secondary: ${secondary};
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    color: var(--text);
  }
  body {
    background: ${theme.bg(primary, secondary)};
    position: relative;
  }

  /* ── Atmosphere layers ── */
  .pattern-overlay {
    position: absolute; inset: 0;
    background: ${theme.pattern ?? "none"};
    pointer-events: none;
    display: ${theme.pattern ? "block" : "none"};
  }
  .noise {
    position: absolute; inset: 0;
    opacity: 0.028;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 128px 128px;
  }
  .light-effects {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 600px 500px at 8% 14%, rgba(255,255,255,0.22), transparent),
      radial-gradient(ellipse 500px 400px at 92% 0%, rgba(255,255,255,0.14), transparent),
      radial-gradient(ellipse 400px 600px at 50% 105%, ${primary}22, transparent);
    pointer-events: none;
  }

  /* ── Glass card ── */
  .card {
    position: relative;
    margin: 24px;
    border-radius: 28px;
    background: var(--card-bg);
    backdrop-filter: blur(40px) saturate(1.4);
    -webkit-backdrop-filter: blur(40px) saturate(1.4);
    border: 1px solid var(--border);
    width: ${width - 48}px;
    height: ${height - 48}px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: 28px;
    background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 40%);
    pointer-events: none;
  }
  .card-padded { padding: 32px 36px; }

  /* ── Typography ── */
  .text-muted { color: var(--text-muted); }
  .tracking-wide { letter-spacing: 0.14em; text-transform: uppercase; }
  .font-black { font-weight: 900; }
  .font-extrabold { font-weight: 800; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .font-medium { font-weight: 500; }
  .mono { font-family: 'Roboto Mono', Menlo, Consolas, monospace; }
  .tabular { font-variant-numeric: tabular-nums; }

  /* ── Badge ── */
  .badge {
    width: 86px; height: 86px;
    border-radius: 50%;
    overflow: hidden;
    border: 2.5px solid rgba(255,255,255,0.22);
    flex-shrink: 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.06);
  }
  .badge img { width: 100%; height: 100%; object-fit: contain; display: block; image-rendering: -webkit-optimize-contrast; padding: 8%; }
  .badge-lg {
    width: 140px; height: 140px;
    border: 3px solid rgba(255,255,255,0.2);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06);
  }
  .badge-xl {
    width: 172px; height: 172px;
    border: 3px solid rgba(255,255,255,0.18);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 80px ${primary}18;
  }

  /* ── Pill ── */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    padding: 8px 18px;
    font-weight: 600;
    font-size: 15px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
  }

  /* ── Stat tile ── */
  .stat-tile {
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 16px 18px;
    gap: 4px;
  }
  .stat-tile .label { font-size: 13px; color: var(--text-muted); font-weight: 500; letter-spacing: 0.03em; }
  .stat-tile .value { font-size: 36px; font-weight: 800; line-height: 1.1; }

  /* ── Record chips ── */
  .record-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 16px;
    padding: 14px 24px;
    min-width: 110px;
    gap: 4px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .record-chip .num { font-size: 40px; font-weight: 800; line-height: 1; }
  .record-chip .label { font-size: 13px; color: var(--text-muted); font-weight: 500; }

  /* ── Result colours ── */
  .result-win { background: rgba(16,185,129,0.2); border-color: rgba(16,185,129,0.18); }
  .result-draw { background: rgba(100,116,139,0.2); border-color: rgba(100,116,139,0.15); }
  .result-loss { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.15); }
  .result-pill-win {
    background: linear-gradient(135deg, rgba(16,185,129,0.35), rgba(16,185,129,0.18));
    border: 1px solid rgba(16,185,129,0.3);
    box-shadow: 0 0 24px rgba(16,185,129,0.2);
  }
  .result-pill-draw {
    background: linear-gradient(135deg, rgba(148,163,184,0.3), rgba(100,116,139,0.2));
    border: 1px solid rgba(148,163,184,0.25);
    box-shadow: 0 0 16px rgba(148,163,184,0.15);
  }
  .result-pill-loss {
    background: linear-gradient(135deg, rgba(239,68,68,0.35), rgba(127,29,29,0.25));
    border: 1px solid rgba(239,68,68,0.3);
    box-shadow: 0 0 24px rgba(239,68,68,0.2);
  }

  /* ── Divider ── */
  .divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  }

  /* ── Glow accent line at card top ── */
  .glow-line {
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${primary}, transparent);
    opacity: 0.6;
    border-radius: 0 0 2px 2px;
  }

  ${extraCss ?? ""}
</style>
</head>
<body>
  <div class="pattern-overlay"></div>
  <div class="noise"></div>
  <div class="light-effects"></div>
  ${content}
</body>
</html>`;
}
