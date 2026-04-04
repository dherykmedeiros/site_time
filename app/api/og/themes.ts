export type OgTheme = "classic" | "dark" | "vibrant";

export interface ThemeConfig {
  name: OgTheme;
  bg: (primary: string, secondary: string) => string;
  cardBg: string;
  text: string;
  textMuted: string;
  accent: string;
  border: string;
  pattern: string | null;
}

const THEMES: Record<OgTheme, ThemeConfig> = {
  classic: {
    name: "classic",
    bg: (primary, secondary) =>
      `linear-gradient(135deg, ${secondary} 0%, ${primary} 55%, ${secondary} 100%)`,
    cardBg: "rgba(0,0,0,0.22)",
    text: "white",
    textMuted: "rgba(255,255,255,0.72)",
    accent: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.14)",
    pattern: null,
  },
  dark: {
    name: "dark",
    bg: (_primary, _secondary) =>
      "linear-gradient(150deg, #0a0f1a 0%, #111827 40%, #1a1f2e 100%)",
    cardBg: "rgba(255,255,255,0.04)",
    text: "white",
    textMuted: "rgba(255,255,255,0.58)",
    accent: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.08)",
    pattern: null,
  },
  vibrant: {
    name: "vibrant",
    bg: (primary, _secondary) =>
      `linear-gradient(135deg, ${primary} 0%, #f59e0b 50%, #ef4444 100%)`,
    cardBg: "rgba(0,0,0,0.28)",
    text: "white",
    textMuted: "rgba(255,255,255,0.82)",
    accent: "rgba(255,255,255,0.12)",
    border: "rgba(255,255,255,0.18)",
    pattern:
      "repeating-linear-gradient(45deg, transparent, transparent 24px, rgba(255,255,255,0.025) 24px, rgba(255,255,255,0.025) 48px)",
  },
};

export function resolveTheme(themeName: string | null): ThemeConfig {
  if (themeName && themeName in THEMES) {
    return THEMES[themeName as OgTheme];
  }
  return THEMES.classic;
}
