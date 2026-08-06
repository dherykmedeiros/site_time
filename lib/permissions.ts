import { Role } from "@prisma/client";

export const permissions = {
  dashboard: { view: "dashboard.view" },
  team: { view: "team.view", manage: "team.manage", manageSettings: "team.settings.manage" },
  players: {
    view: "players.view",
    manage: "players.manage",
    invite: "players.invite",
    promote: "players.promote",
    evaluate: "players.evaluate",
    viewPrivateData: "players.private.view",
  },
  matches: {
    view: "matches.view",
    create: "matches.create",
    manage: "matches.manage",
    summon: "matches.summon",
    manageRsvp: "matches.rsvp.manage",
    publishLineup: "matches.lineup.publish",
    manageLive: "matches.live.manage",
    finalizeReport: "matches.report.finalize",
  },
  finances: {
    view: "finances.view",
    manage: "finances.manage",
    approvePayments: "payments.approve",
    viewPlayerFinance: "players.finance.view",
    export: "finances.export",
  },
  equipment: { view: "equipment.view", manage: "equipment.manage" },
  reports: { view: "reports.view", export: "reports.export" },
  notifications: { send: "notifications.send" },
  audit: { view: "audit.view" },
} as const;

type ExtractValues<T> = T extends object ? ExtractValues<T[keyof T]> : T;
export type Permission = ExtractValues<typeof permissions>;

const allPermissions: Permission[] = [
  "dashboard.view",
  "team.view", "team.manage", "team.settings.manage",
  "players.view", "players.manage", "players.invite", "players.promote", "players.evaluate", "players.private.view",
  "matches.view", "matches.create", "matches.manage", "matches.summon", "matches.rsvp.manage", "matches.lineup.publish", "matches.live.manage", "matches.report.finalize",
  "finances.view", "finances.manage", "payments.approve", "players.finance.view", "finances.export",
  "equipment.view", "equipment.manage",
  "reports.view", "reports.export",
  "notifications.send",
  "audit.view",
];

export const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: allPermissions,
  COACH: [
    "dashboard.view", "team.view", "players.view", "players.manage", "players.invite", "players.evaluate", "players.private.view",
    "matches.view", "matches.create", "matches.manage", "matches.summon", "matches.rsvp.manage", "matches.lineup.publish", "matches.live.manage", "matches.report.finalize",
    "reports.view", "reports.export", "notifications.send",
  ],
  MATERIAL_DIRECTOR: [
    "dashboard.view", "team.view", "players.view", "matches.view", "equipment.view", "equipment.manage",
  ],
  PLAYER: [
    "dashboard.view", "players.view", "matches.view",
  ],
};

export function canUser(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function getUserPermissions(role: Role): Permission[] {
  return rolePermissions[role];
}
