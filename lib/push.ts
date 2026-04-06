import webpush from "web-push";
import { prisma } from "@/lib/prisma";

let configured = false;

function ensureVapidConfigured() {
  if (configured) return;

  const contact = process.env.PUSH_CONTACT_EMAIL;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!contact || !publicKey || !privateKey) {
    return;
  }

  webpush.setVapidDetails(`mailto:${contact}`, publicKey, privateKey);
  configured = true;
}

export function isPushConfigured() {
  return Boolean(
    process.env.PUSH_CONTACT_EMAIL &&
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY
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

export async function sendPushToUsers(
  userIds: string[],
  payload: { title: string; body: string; url?: string; tag?: string }
): Promise<{ sent: number; failed: number }> {
  const uniqueUserIds = Array.from(new Set(userIds.filter(Boolean)));

  if (uniqueUserIds.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const results = await Promise.all(
    uniqueUserIds.map((userId) => sendPushToUser(userId, payload))
  );

  return results.reduce(
    (acc, result) => ({
      sent: acc.sent + result.sent,
      failed: acc.failed + result.failed,
    }),
    { sent: 0, failed: 0 }
  );
}

export async function notifyScheduledMatch(matchId: string): Promise<{ sent: number; failed: number }> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      date: true,
      opponent: true,
      venue: true,
      team: {
        select: {
          players: {
            where: { status: "ACTIVE", user: { isNot: null } },
            select: { user: { select: { id: true } } },
          },
        },
      },
    },
  });

  if (!match) {
    return { sent: 0, failed: 0 };
  }

  const userIds = match.team.players
    .map((player: (typeof match.team.players)[number]) => player.user?.id)
    .filter((userId: string | undefined): userId is string => Boolean(userId));

  if (userIds.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const dateStr = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(match.date);

  return sendPushToUsers(userIds, {
    title: "Nova partida agendada",
    body: `vs ${match.opponent} em ${dateStr} · ${match.venue}`,
    url: `/matches/${match.id}`,
    tag: `match-scheduled-${match.id}`,
  });
}

export async function notifyMatchResultPosted(matchId: string): Promise<{ sent: number; failed: number }> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    select: {
      id: true,
      opponent: true,
      homeScore: true,
      awayScore: true,
      matchStats: {
        select: {
          goals: true,
          assists: true,
          player: {
            select: {
              name: true,
              user: { select: { id: true } },
            },
          },
        },
      },
    },
  });

  if (!match || match.homeScore === null || match.awayScore === null) {
    return { sent: 0, failed: 0 };
  }

  const notifications = match.matchStats
    .map((stat: (typeof match.matchStats)[number]) => {
      const userId = stat.player.user?.id;
      if (!userId) return null;

      const performanceBits: string[] = [];
      if (stat.goals > 0) performanceBits.push(`${stat.goals} gol${stat.goals > 1 ? "s" : ""}`);
      if (stat.assists > 0) {
        performanceBits.push(`${stat.assists} assistência${stat.assists > 1 ? "s" : ""}`);
      }

      const performanceText =
        performanceBits.length > 0 ? ` · Sua atuação: ${performanceBits.join(" e ")}` : "";

      return {
        userId,
        payload: {
          title: "Resultado registrado",
          body: `vs ${match.opponent}: ${match.homeScore} x ${match.awayScore}${performanceText}`,
          url: `/matches/${match.id}`,
          tag: `match-result-${match.id}-${userId}`,
        },
      };
    })
    .filter(
      (item: {
        userId: string;
        payload: { title: string; body: string; url: string; tag: string };
      } | null): item is {
        userId: string;
        payload: { title: string; body: string; url: string; tag: string };
      } => Boolean(item)
    );

  if (notifications.length === 0) {
    return { sent: 0, failed: 0 };
  }

  const results = await Promise.all(
    notifications.map(
      ({ userId, payload }: (typeof notifications)[number]) => sendPushToUser(userId, payload)
    )
  );

  return results.reduce(
    (acc: { sent: number; failed: number }, result: { sent: number; failed: number }) => ({
      sent: acc.sent + result.sent,
      failed: acc.failed + result.failed,
    }),
    { sent: 0, failed: 0 }
  );
}
