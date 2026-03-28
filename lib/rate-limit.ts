const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

// Registration: 10 attempts per IP per hour
const REGISTER_WINDOW_MS = 60 * 60 * 1000;
const REGISTER_MAX_REQUESTS = 10;

// Cleanup expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (value.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

function rateLimitWithConfig(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterMinutes: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMinutes: 0 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterMinutes = Math.ceil((entry.resetAt - now) / (60 * 1000));
    return { allowed: false, retryAfterMinutes };
  }

  entry.count++;
  return { allowed: true, retryAfterMinutes: 0 };
}

export function rateLimit(ip: string): { allowed: boolean; retryAfterMinutes: number } {
  return rateLimitWithConfig(`friendly:${ip}`, MAX_REQUESTS, WINDOW_MS);
}

export function rateLimitRegister(ip: string): { allowed: boolean; retryAfterMinutes: number } {
  return rateLimitWithConfig(`register:${ip}`, REGISTER_MAX_REQUESTS, REGISTER_WINDOW_MS);
}
