import webpush from "web-push";
import { prisma } from "@/lib/prisma";

let configured = false;

function getEnv(name: string): string | undefined {
  const env =
    (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ??
    {};
  return env[name];
}

function ensureVapidConfigured() {
  if (configured) return;

  const contact = getEnv("PUSH_CONTACT_EMAIL");
  const publicKey = getEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY");
  const privateKey = getEnv("VAPID_PRIVATE_KEY");

  if (!contact || !publicKey || !privateKey) {
    return;
  }

  webpush.setVapidDetails(`mailto:${contact}`, publicKey, privateKey);
  configured = true;
}

export function isPushConfigured() {
  return Boolean(
    getEnv("PUSH_CONTACT_EMAIL") &&
      getEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY") &&
      getEnv("VAPID_PRIVATE_KEY")
  );
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url?: string; tag?: string }
): Promise<{ sent: number; failed: number }> {
  ensureVapidConfigured();

  if (!isPushConfigured()) {
    return { sent: 0, failed: 0 };
  }

  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });

  if (subs.length === 0) {
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  const encodedPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url || "/",
    tag: payload.tag,
    icon: "/next.svg",
    badge: "/next.svg",
  });

  await Promise.all(
    subs.map(async (sub: (typeof subs)[number]) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          encodedPayload
        );
        sent += 1;
      } catch {
        failed += 1;
        // Remove broken subscriptions (expired/unsubscribed)
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
    })
  );

  return { sent, failed };
}
