/** Validate and sanitize a CSS hex color to prevent injection */
export function safeHex(color: string | null | undefined, fallback: string): string {
  if (!color) return fallback;
  return /^#[0-9a-fA-F]{3,8}$/.test(color) ? color : fallback;
}