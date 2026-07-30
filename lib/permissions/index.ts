import { ROLE_PERMISSIONS } from "./roles";
import type { Role, Permission } from "./types";

export type { Role, Permission };

/**
 * Verifica se uma role tem determinada permissão.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Verifica se uma role tem qualquer uma das permissões listadas.
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Verifica se uma role tem todas as permissões listadas.
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

// Semantic helpers for common checks
export function canViewMatch(role: Role): boolean {
  return hasPermission(role, "match:view");
}

export function canManageMatch(role: Role): boolean {
  return hasAnyPermission(role, ["match:create", "match:edit"]);
}

export function canPublishLineup(role: Role): boolean {
  return hasPermission(role, "lineup:publish");
}

export function canManageFinances(role: Role): boolean {
  return hasPermission(role, "finance:manage");
}

export function canViewPlayerFinance(role: Role): boolean {
  return hasAnyPermission(role, ["finance:view_own", "finance:view"]);
}

export function canManageEquipment(role: Role): boolean {
  return hasPermission(role, "equipment:manage");
}

export function canApplyFine(role: Role): boolean {
  return hasPermission(role, "fine:create");
}

export function canViewReports(role: Role): boolean {
  return hasPermission(role, "report:view");
}

export function canManageTeamSettings(role: Role): boolean {
  return hasPermission(role, "team:manage");
}

export function canManagePlayers(role: Role): boolean {
  return hasPermission(role, "player:create");
}

export function canCreateAnnouncement(role: Role): boolean {
  return hasPermission(role, "message:create");
}

export function canManageTactical(role: Role): boolean {
  return hasPermission(role, "tactical:manage");
}
