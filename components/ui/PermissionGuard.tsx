import { ReactNode } from "react";
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions';
import type { Role, Permission } from '@/lib/permissions';

interface PermissionGuardProps {
  /** A permissão única ou lista de permissões a serem verificadas */
  permission: Permission | Permission[];
  /** O papel do usuário atual */
  role: Role;
  /** Como avaliar um array de permissões: requer 'any' (qualquer uma) ou 'all' (todas) */
  mode?: "any" | "all";
  /** Conteúdo de fallback caso não tenha permissão */
  fallback?: ReactNode;
  /** Conteúdo protegido */
  children: ReactNode;
}

/**
 * Componente PermissionGuard para renderização condicional baseada em permissões e papel
 * Funciona tanto no servidor quanto no cliente
 */
export function PermissionGuard({
  permission,
  role,
  mode = "any",
  fallback = null,
  children,
}: PermissionGuardProps) {
  let hasAccess = false;

  if (Array.isArray(permission)) {
    if (mode === "all") {
      hasAccess = hasAllPermissions(role, permission);
    } else {
      hasAccess = hasAnyPermission(role, permission);
    }
  } else {
    hasAccess = hasPermission(role, permission);
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
