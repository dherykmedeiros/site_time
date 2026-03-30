const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

// Registration: 10 attempts per IP per hour
const REGISTER_WINDOW_MS = 60 * 60 * 1000;
const REGISTER_MAX_REQUESTS = 10;

// Upload and invite endpoints are sensitive write operations.
const UPLOAD_WINDOW_MS = 15 * 60 * 1000;
const UPLOAD_MAX_REQUESTS = 20;

const INVITE_WINDOW_MS = 60 * 60 * 1000;
const INVITE_MAX_REQUESTS = 20;

// Cleanup expired entries every 10 minutes
const cleanupHandle = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (value.resetAt < now) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

if (typeof cleanupHandle.unref === "function") {
  cleanupHandle.unref();
}

type RateLimitResult = { allowed: boolean; retryAfterMinutes: number };

function parsePipelineResult(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }

  const maybeResult = value as { result?: unknown };
  return maybeResult.result ?? value;
}

async function rateLimitDistributed(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return null;
  }

  try {
    const pipelineUrl = `${redisUrl.replace(/\/$/, "")}/pipeline`;

    const response = await fetch(pipelineUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["PEXPIRE", key, windowMs, "NX"],
        ["PTTL", key],
      ]),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (!Array.isArray(payload) || payload.length < 3) {
      return null;
    }

    const count = Number(parsePipelineResult(payload[0]));
    const ttlMs = Number(parsePipelineResult(payload[2]));

    if (!Number.isFinite(count)) {
      return null;
    }

    if (count > maxRequests) {
      const ttl = Number.isFinite(ttlMs) && ttlMs > 0 ? ttlMs : windowMs;
      return {
        allowed: false,
        retryAfterMinutes: Math.max(1, Math.ceil(ttl / (60 * 1000))),
      };
    }

    return { allowed: true, retryAfterMinutes: 0 };
  } catch {
    return null;
  }
}

function rateLimitWithConfigLocal(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
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

async function rateLimitWithConfig(
  namespace: string,
  ip: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const key = `${namespace}:${ip}`;

  const distributed = await rateLimitDistributed(key, maxRequests, windowMs);
  if (distributed) {
    return distributed;
  }

  return rateLimitWithConfigLocal(key, maxRequests, windowMs);
}

export async function rateLimit(ip: string): Promise<RateLimitResult> {
  return rateLimitWithConfig("friendly", ip, MAX_REQUESTS, WINDOW_MS);
}

export async function rateLimitRegister(ip: string): Promise<RateLimitResult> {
  return rateLimitWithConfig("register", ip, REGISTER_MAX_REQUESTS, REGISTER_WINDOW_MS);
}

export async function rateLimitUpload(ip: string): Promise<RateLimitResult> {
  return rateLimitWithConfig("upload", ip, UPLOAD_MAX_REQUESTS, UPLOAD_WINDOW_MS);
}

export async function rateLimitInvite(ip: string): Promise<RateLimitResult> {
  return rateLimitWithConfig("invite", ip, INVITE_MAX_REQUESTS, INVITE_WINDOW_MS);
}
