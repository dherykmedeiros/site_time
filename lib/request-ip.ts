const IPV4_RE = /^\d{1,3}(?:\.\d{1,3}){3}$/;
const IPV6_RE = /^[A-Fa-f0-9:]+$/;

function sanitizeIp(value: string | null): string | null {
  if (!value) return null;

  const ip = value.trim();
  if (!ip) return null;

  if (IPV4_RE.test(ip) || IPV6_RE.test(ip)) {
    return ip;
  }

  return null;
}

export function extractClientIp(request: Request): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0]?.trim() ?? null;
    const ip = sanitizeIp(first);
    if (ip) return ip;
  }

  const candidates = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-client-ip"),
  ];

  for (const candidate of candidates) {
    const ip = sanitizeIp(candidate);
    if (ip) return ip;
  }

  return "unknown";
}
