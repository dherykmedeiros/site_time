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
  }).format(date);
}

export function formatDateOnly(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
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
