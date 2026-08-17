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
 * Parses DMS (Degrees Minutes Seconds) or DMM (Degrees Decimal Minutes) strings into decimal degrees.
 * Supports:
 * - 23°33'01.9"S 46°38'00.0"W
 * - 23° 33' 01.9" S, 46° 38' 00.0" O (Portuguese Oeste)
 * - 23°33.031'S, 46°38.000'W
 * - -23°33'01.9", -46°38'00.0"
 * - 23.55052° S, 46.63330° W
 * - 23.55052S, 46.63330W
 */
export function parseDMSCoordinates(text: string): { latitude: number; longitude: number } | null {
  if (!text) return null;

  // Normalize quotes and spaces
  const clean = text
    .replace(/[″”]/g, '"')
    .replace(/[′’]/g, "'")
    .replace(/\+/g, " ")
    .trim();

  // Pattern for DMS: deg° [min'] [sec"] [H] or decimal deg [H]
  const dmsPartRegex =
    /(-?\d+(?:\.\d+)?)\s*°?(?:\s*(\d+(?:\.\d+)?)\s*')?(?:\s*(\d+(?:\.\d+)?)\s*")?\s*([NSEWO])?/i;

  // Split by comma, slash, or space between coordinate components
  const parts = clean.split(/[,;\/]+|\s+(?=[+-]?\d|S|N|E|W|O)/i).map((s) => s.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const latMatch = parts[0].match(dmsPartRegex);
    const lonMatch = parts[1].match(dmsPartRegex);

    if (latMatch && lonMatch) {
      const parseComponent = (match: RegExpMatchArray, isLat: boolean): number | null => {
        const deg = parseFloat(match[1]);
        if (isNaN(deg)) return null;
        const min = match[2] ? parseFloat(match[2]) : 0;
        const sec = match[3] ? parseFloat(match[3]) : 0;
        const hemi = match[4] ? match[4].toUpperCase() : null;

        let decimal = Math.abs(deg) + min / 60 + sec / 3600;
        if (deg < 0 || hemi === "S" || hemi === "W" || hemi === "O") {
          decimal = -decimal;
        }

        if (isLat && (decimal < -90 || decimal > 90)) return null;
        if (!isLat && (decimal < -180 || decimal > 180)) return null;

        return decimal;
      };

      const lat = parseComponent(latMatch, true);
      const lon = parseComponent(lonMatch, false);

      if (lat !== null && lon !== null) {
        return {
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lon.toFixed(6)),
        };
      }
    }
  }

  // Single regex matching full DMS pair: e.g. 23°33'01.9"S 46°38'00.0"W
  const fullDmsRegex =
    /(\d+(?:\.\d+)?)\s*°\s*(?:(\d+(?:\.\d+)?)\s*')?\s*(?:(\d+(?:\.\d+)?)\s*")?\s*([NS])\s*[,;\s]\s*(\d+(?:\.\d+)?)\s*°\s*(?:(\d+(?:\.\d+)?)\s*')?\s*(?:(\d+(?:\.\d+)?)\s*")?\s*([EWO])/i;
  const fullMatch = clean.match(fullDmsRegex);
  if (fullMatch) {
    const latDeg = parseFloat(fullMatch[1]);
    const latMin = fullMatch[2] ? parseFloat(fullMatch[2]) : 0;
    const latSec = fullMatch[3] ? parseFloat(fullMatch[3]) : 0;
    const latHemi = fullMatch[4].toUpperCase();

    const lonDeg = parseFloat(fullMatch[5]);
    const lonMin = fullMatch[6] ? parseFloat(fullMatch[6]) : 0;
    const lonSec = fullMatch[7] ? parseFloat(fullMatch[7]) : 0;
    const lonHemi = fullMatch[8].toUpperCase();

    let lat = latDeg + latMin / 60 + latSec / 3600;
    if (latHemi === "S") lat = -lat;

    let lon = lonDeg + lonMin / 60 + lonSec / 3600;
    if (lonHemi === "W" || lonHemi === "O") lon = -lon;

    if (isValidLatLon(lat, lon)) {
      return {
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lon.toFixed(6)),
      };
    }
  }

  return null;
}

/**
 * Extracts latitude and longitude from a Google Maps URL, Apple Maps, Waze, or simple coordinate string.
 * Supports text containing URLs pasted from mobile share sheets or dropped pin links.
 */
export function extractCoordsFromGoogleMaps(url: string): { latitude: number; longitude: number } | null {
  if (!url) return null;

  // Extract clean URL if text surrounds it (e.g. from mobile share sheet)
  const urlMatch = url.match(/(https?:\/\/[^\s>"]+)/i);
  let targetStr = (urlMatch ? urlMatch[1] : url).trim();
  // Strip trailing punctuation often attached from mobile share sheets (e.g. "https://maps.app.goo.gl/xyz.")
  targetStr = targetStr.replace(/[.,;:!?)]+$/, "");

  // Pattern 0A: DMS Coordinates in input text
  const dmsCoords = parseDMSCoordinates(targetStr);
  if (dmsCoords) {
    return dmsCoords;
  }

  // Pattern 0B: Direct "lat, lon" or "lat lon" or "(lat, lon)" or "lat; lon"
  const cleanCoordsStr = targetStr.replace(/^[(\[]|[)\]]$/g, "").trim();
  const simpleCoordsRegex = /^(-?\d+\.\d+)\s*[,;\s]+\s*(-?\d+\.\d+)$/;
  const simpleMatch = cleanCoordsStr.match(simpleCoordsRegex);
  if (simpleMatch) {
    const lat = parseFloat(simpleMatch[1]);
    const lon = parseFloat(simpleMatch[2]);
    if (isValidLatLon(lat, lon)) {
      return { latitude: Number(lat.toFixed(6)), longitude: Number(lon.toFixed(6)) };
    }
  }

  // Decode URL components if query string exists (to handle %2C for commas, %20 for spaces)
  let decodedStr = targetStr;
  try {
    decodedStr = decodeURIComponent(targetStr);
  } catch {}

  // Check if decoded URL path contains DMS (e.g. /place/23°33'01.9"S+46°38'00.0"W/...)
  const placeDmsMatch = decodedStr.match(/\/place\/([^/@?]+)/i);
  if (placeDmsMatch && placeDmsMatch[1]) {
    const parsedPlaceDms = parseDMSCoordinates(placeDmsMatch[1]);
    if (parsedPlaceDms) {
      return parsedPlaceDms;
    }
  }

  const patterns: Array<{ regex: RegExp; latIndex: number; lonIndex: number }> = [
    // Pattern 1: Protobuf !3d(lat)!4d(lon) - standard in Google Maps place links (EXACT PLACE/DROPPED PIN)
    { regex: /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/, latIndex: 1, lonIndex: 2 },
    // Pattern 2: Protobuf !1d(lon)!2d(lat) - Directions / Pin variant in Google Maps
    { regex: /!1d(-?\d+(?:\.\d+)?)!2d(-?\d+(?:\.\d+)?)/, latIndex: 2, lonIndex: 1 },
    // Pattern 3: /place/(-?\d+\.\d+),(-?\d+\.\d+) or /place/(-?\d+\.\d+)\+(-?\d+\.\d+) - Explicit place path
    { regex: /\/place\/(-?\d+\.\d+)(?:%2C|,|\+)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
    // Pattern 4: q=, query=, ll=, destination=, daddr=, saddr=, center=, cbll= in URL query params
    { regex: /[?&](?:q|query|daddr|saddr|destination|center|cbll|ll)=(?:loc:)?(-?\d+\.\d+)(?:%2C|,|\+|\s+)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
    // Pattern 5: staticmap center= or markers=
    { regex: /[?&](?:center|markers)=(?:[^&|]*\|)?(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
    // Pattern 6: /search/(-?\d+\.\d+),(-?\d+\.\d+)
    { regex: /\/search\/(-?\d+\.\d+)(?:%2C|,|\+|\s+)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
    // Pattern 7: /dir//(-?\d+\.\d+),(-?\d+\.\d+)
    { regex: /\/dir\/[^\/]*\/(-?\d+\.\d+)(?:%2C|,|\+)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
    // Pattern 8: Waze to=ll.lat,lon or ll=lat,lon
    { regex: /(?:to=ll\.|[?&]ll=)(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/i, latIndex: 1, lonIndex: 2 },
    // Pattern 9: /@(-?\d+\.\d+),(-?\d+\.\d+)/ - Camera viewport center (FALLBACK if no explicit pin coords exist)
    { regex: /@(-?\d+\.\d+),(-?\d+\.\d+)/, latIndex: 1, lonIndex: 2 },
  ];

  for (const strToTest of [targetStr, decodedStr]) {
    for (const { regex, latIndex, lonIndex } of patterns) {
      const match = strToTest.match(regex);
      if (match) {
        const lat = parseFloat(match[latIndex]);
        const lon = parseFloat(match[lonIndex]);
        if (isValidLatLon(lat, lon)) {
          return {
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lon.toFixed(6)),
          };
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
  let cleanUrl = (urlMatch ? urlMatch[1] : url).trim();
  cleanUrl = cleanUrl.replace(/[.,;:!?)]+$/, "");

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

    // Call GET request with Desktop User-Agent to ensure Google redirects to standard web URL with !3d and !4d
    const res = await fetch(cleanUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      }
    });

    const finalUrl = res.url;

    // Check if redirect ended at a consent or interstitial redirect containing the destination URL
    try {
      const finalParsedUrl = new URL(finalUrl);
      const continueParam =
        finalParsedUrl.searchParams.get("continue") ||
        finalParsedUrl.searchParams.get("url") ||
        finalParsedUrl.searchParams.get("q");
      if (continueParam && extractCoordsFromGoogleMaps(continueParam)) {
        return continueParam;
      }
    } catch {}

    if (extractCoordsFromGoogleMaps(finalUrl)) {
      return finalUrl;
    }

    // Fallback: Check response HTML if redirect stopped at an HTML landing/preview page
    const html = await res.text();
    
    // 1. Check canonical / og:url / meta refresh in HTML
    const ogUrlMatch =
      html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i) ||
      html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["']([^"']*url=([^"']+))["']/i);
    if (ogUrlMatch) {
      const canonicalUrl = ogUrlMatch[1] || ogUrlMatch[2];
      if (canonicalUrl && extractCoordsFromGoogleMaps(canonicalUrl)) {
        return canonicalUrl;
      }
    }

    // 2. Check static map image preview in HTML (og:image or itemprop="image")
    const ogImageMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/i);
    if (ogImageMatch && ogImageMatch[1]) {
      const coords = extractCoordsFromGoogleMaps(ogImageMatch[1]);
      if (coords) {
        return `https://www.google.com/maps/@${coords.latitude},${coords.longitude},17z`;
      }
    }

    // 3. Check JSON-LD GeoCoordinates
    const jsonLdMatch = html.match(/"@type"\s*:\s*"GeoCoordinates"[\s\S]*?"latitude"\s*:\s*(-?\d+\.\d+)[\s\S]*?"longitude"\s*:\s*(-?\d+\.\d+)/i);
    if (jsonLdMatch) {
      const lat = parseFloat(jsonLdMatch[1]);
      const lon = parseFloat(jsonLdMatch[2]);
      if (isValidLatLon(lat, lon)) {
        return `https://www.google.com/maps/@${lat},${lon},17z`;
      }
    }

    // 4. Check explicit static map or center parameter inside HTML
    const htmlCoordMatch =
      html.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i) ||
      html.match(/center=(-?\d+\.\d+)(?:%2C|,)(-?\d+\.\d+)/i) ||
      html.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/i);
    if (htmlCoordMatch) {
      return `https://www.google.com/maps/@${htmlCoordMatch[1]},${htmlCoordMatch[2]},17z`;
    }

    // 5. Check Google Maps APP_INITIALIZATION_STATE payload: window.APP_INITIALIZATION_STATE=[[[scale,lon,lat]...]]
    const appStateMatch = html.match(/window\.APP_INITIALIZATION_STATE\s*=\s*\[\[\[\d+(?:\.\d+)?\s*,\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*\]/);
    if (appStateMatch) {
      const lon = parseFloat(appStateMatch[1]);
      const lat = parseFloat(appStateMatch[2]);
      if (isValidLatLon(lat, lon)) {
        return `https://www.google.com/maps/@${lat},${lon},17z`;
      }
    }

    return finalUrl;
  } catch (error) {
    console.error("Error resolving short URL:", error);
    return cleanUrl;
  }
}


