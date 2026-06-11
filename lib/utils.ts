import { randomUUID } from "crypto";

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateUUID(): string {
  return randomUUID();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(date);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function isPastDate(date: Date): boolean {
  return date < new Date();
}

// SSRF-safe URL allowlist: local uploads or HTTPS with no internal IPs
const BLOCKED_HOSTS_RE =
  /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|\[::1\]|0\.0\.0\.0)/i;

export function isSafeUrl(value: string): boolean {
  if (!value) return true;
  if (value.startsWith("/uploads/")) return true;
  if (!value.startsWith("https://")) return false;

  try {
    const url = new URL(value);
    if (BLOCKED_HOSTS_RE.test(url.hostname)) return false;
    // Block IP-based hosts entirely to avoid bypasses
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely resolves a short Google Maps URL to its final redirected URL.
 * Only follows redirects for allowed Google domains to prevent SSRF.
 */
export async function resolveGoogleMapsUrl(url: string): Promise<string> {
  if (!url) return url;
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Only follow redirects for trusted google domains
    const isGoogleDomain = 
      hostname === "maps.app.goo.gl" || 
      hostname === "goo.gl" || 
      hostname.endsWith(".google.com") || 
      hostname.endsWith(".google.com.br") ||
      hostname === "google.com" ||
      hostname === "google.com.br";
      
    if (!isGoogleDomain) {
      return url;
    }

    // Call HEAD request to follow redirects
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      }
    });
    return res.url;
  } catch (error) {
    console.error("Error resolving short URL:", error);
    return url;
  }
}

/**
 * Extracts latitude and longitude from a Google Maps URL or a simple coordinate string.
 */
export function extractCoordsFromGoogleMaps(url: string): { latitude: number; longitude: number } | null {
  if (!url) return null;

  // Pattern for direct "lat, lon" or "lat,lon" input
  const simpleCoordsRegex = /^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/;
  const simpleMatch = url.trim().match(simpleCoordsRegex);
  if (simpleMatch) {
    const lat = parseFloat(simpleMatch[1]);
    const lon = parseFloat(simpleMatch[2]);
    if (!isNaN(lat) && !isNaN(lon)) {
      return { latitude: lat, longitude: lon };
    }
  }

  // Patterns for coordinates inside Google Maps URLs
  const patterns = [
    // Pattern 1: /@(-?\d+\.\d+),(-?\d+\.\d+)/ (most common in web search/maps)
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    // Pattern 2: /place/(-?\d+\.\d+),(-?\d+\.\d+)/
    /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/,
    // Pattern 3: q=(-?\d+\.\d+),(-?\d+\.\d+)
    /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
    // Pattern 4: ll=(-?\d+\.\d+),(-?\d+\.\d+)
    /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lon = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lon)) {
        return { latitude: lat, longitude: lon };
      }
    }
  }

  return null;
}

