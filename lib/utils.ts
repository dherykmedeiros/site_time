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

export function parseLocalDate(val: string | Date | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    return val;
  }
  const str = String(val).trim();
  if (!str) return null;

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (dateOnlyMatch) {
    const y = parseInt(dateOnlyMatch[1], 10);
    const m = parseInt(dateOnlyMatch[2], 10);
    const d = parseInt(dateOnlyMatch[3], 10);
    return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(date: Date | string): string {
  const d = parseLocalDate(date);
  if (!d) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(d);
}

export function formatDateOnly(
  val: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = parseLocalDate(val);
  if (!d) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeZone: "America/Sao_Paulo",
    ...options,
  }).format(d);
}

export function toInputDateString(val: string | Date | null | undefined): string {
  if (!val) return "";
  if (val instanceof Date) {
    const y = val.getUTCFullYear();
    const m = String(val.getUTCMonth() + 1).padStart(2, "0");
    const d = String(val.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const str = String(val).trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  const parsed = new Date(str);
  if (isNaN(parsed.getTime())) return "";
  const y = parsed.getUTCFullYear();
  const m = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const d = String(parsed.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toApiIsoDate(dateStr: string | Date | null | undefined): string {
  const d = parseLocalDate(dateStr);
  if (!d) return new Date().toISOString();
  return d.toISOString();
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

/**
 * Formata e mascara o CPF para conformidade com a LGPD (ex: ***.***.753-30)
 */
export function maskCpf(cpf: string | null | undefined): string {
  if (!cpf) return "";
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return cpf;
  return `***.***.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
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
 * Extracts latitude and longitude from a Google Maps URL, Apple Maps, Waze, or simple coordinate string.
 * Supports text containing URLs pasted from mobile share sheets.
 */
export function extractCoordsFromGoogleMaps(url: string): { latitude: number; longitude: number } | null {
  if (!url) return null;

  // Extract clean URL if text surrounds it (e.g. from mobile share sheet)
  const urlMatch = url.match(/(https?:\/\/[^\s>"]+)/i);
  const targetStr = (urlMatch ? urlMatch[1] : url).trim();

  // Pattern 0: Direct "lat, lon" or "lat,lon" input
  const simpleCoordsRegex = /^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/;
  const simpleMatch = targetStr.match(simpleCoordsRegex);
  if (simpleMatch) {
    const lat = parseFloat(simpleMatch[1]);
    const lon = parseFloat(simpleMatch[2]);
    if (isValidLatLon(lat, lon)) {
      return { latitude: lat, longitude: lon };
    }
  }

  // Decode URL components if query string exists (to handle %2C for commas)
  let decodedStr = targetStr;
  try {
    decodedStr = decodeURIComponent(targetStr);
  } catch {}

  const patterns: Array<{ regex: RegExp; latIndex: number; lonIndex: number }> = [
    // Pattern 1: /@(-?\d+\.\d+),(-?\d+\.\d+)/ (most common in web search/maps)
    { regex: /@(-?\d+\.\d+),(-?\d+\.\d+)/, latIndex: 1, lonIndex: 2 },
    // Pattern 2: /place/(-?\d+\.\d+),(-?\d+\.\d+)/
    { regex: /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/, latIndex: 1, lonIndex: 2 },
    // Pattern 3: Protobuf !3d(lat)!4d(lon) - standard in Google Maps mobile/desktop place links
    { regex: /!3d(-?\d+\.\d+).*?!4d(-?\d+\.\d+)/, latIndex: 1, lonIndex: 2 },
    // Pattern 4: Protobuf !2d(lon)!3d(lat)
    { regex: /!2d(-?\d+\.\d+).*?!3d(-?\d+\.\d+)/, latIndex: 2, lonIndex: 1 },
    // Pattern 5: q=, query=, ll=, destination=, daddr=, saddr=, center=, cbll= in URL query params
    { regex: /[?&](?:q|query|daddr|saddr|destination|center|cbll|ll)=(-?\d+\.\d+)(?:%2C|,|\s+)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
    // Pattern 6: /search/(-?\d+\.\d+),(-?\d+\.\d+)
    { regex: /\/search\/(-?\d+\.\d+)(?:%2C|,|\s+)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
    // Pattern 7: Waze to=ll.lat,lon
    { regex: /to=ll\.(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
  ];

  for (const strToTest of [targetStr, decodedStr]) {
    for (const { regex, latIndex, lonIndex } of patterns) {
      const match = strToTest.match(regex);
      if (match) {
        const lat = parseFloat(match[latIndex]);
        const lon = parseFloat(match[lonIndex]);
        if (isValidLatLon(lat, lon)) {
          return { latitude: lat, longitude: lon };
        }
      }
    }
  }

  return null;
}

function isValidLatLon(lat: number, lon: number): boolean {
  return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

/**
 * Safely resolves a short Google Maps URL (or mobile share link) to its final redirected URL or extracts coordinates.
 * Only follows redirects for allowed map/google domains to prevent SSRF.
 */
export async function resolveGoogleMapsUrl(url: string): Promise<string> {
  if (!url) return url;

  // Extract clean URL if text surrounds it (e.g. from mobile share sheet)
  const urlMatch = url.match(/(https?:\/\/[^\s>"]+)/i);
  const cleanUrl = (urlMatch ? urlMatch[1] : url).trim();

  // If coordinates are already extractable from the URL directly, no need to resolve network call
  if (extractCoordsFromGoogleMaps(cleanUrl)) {
    return cleanUrl;
  }

  try {
    const parsedUrl = new URL(cleanUrl);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Only follow redirects for trusted google/map domains
    const isMapDomain = 
      hostname === "maps.app.goo.gl" || 
      hostname === "goo.gl" || 
      hostname.endsWith(".google.com") || 
      hostname.endsWith(".google.com.br") ||
      hostname === "google.com" ||
      hostname === "google.com.br" ||
      hostname === "waze.com" ||
      hostname.endsWith(".waze.com") ||
      hostname === "maps.apple.com";
      
    if (!isMapDomain) {
      return cleanUrl;
    }

    // Call GET request with browser/mobile User-Agent to follow full redirects
    const res = await fetch(cleanUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      }
    });

    const finalUrl = res.url;
    if (extractCoordsFromGoogleMaps(finalUrl)) {
      return finalUrl;
    }

    // Fallback: Check response HTML if redirect stopped at an HTML landing/preview page
    const html = await res.text();
    
    // Check canonical / og:url / meta refresh in HTML
    const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i) ||
                       html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)["']/i);
    if (ogUrlMatch && ogUrlMatch[1]) {
      const canonicalUrl = ogUrlMatch[1];
      if (extractCoordsFromGoogleMaps(canonicalUrl)) {
        return canonicalUrl;
      }
    }

    // Check static map or center parameter inside HTML
    const htmlCoordMatch = html.match(/center=(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/i) ||
                           html.match(/!3d(-?\d+\.\d+).*?!4d(-?\d+\.\d+)/i) ||
                           html.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/i);
    if (htmlCoordMatch) {
      return `https://www.google.com/maps/@${htmlCoordMatch[1]},${htmlCoordMatch[2]},17z`;
    }

    // Check embedded JS arrays in HTML payload (e.g. window.BSO or Google Maps payloads: [scale/id, lon, lat])
    const arrayMatches = [...html.matchAll(/\[\s*\d+(?:\.\d+)?\s*,\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*\]/g)];
    for (const match of arrayMatches) {
      const val1 = parseFloat(match[1]);
      const val2 = parseFloat(match[2]);

      // Check if val2 is lat and val1 is lon
      if (isValidLatLon(val2, val1)) {
        return `https://www.google.com/maps/@${val2},${val1},17z`;
      }
      // Check if val1 is lat and val2 is lon
      if (isValidLatLon(val1, val2)) {
        return `https://www.google.com/maps/@${val1},${val2},17z`;
      }
    }

    return finalUrl;
  } catch (error) {
    console.error("Error resolving short URL:", error);
    return cleanUrl;
  }
}


