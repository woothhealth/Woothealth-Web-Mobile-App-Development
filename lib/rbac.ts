import { normalizeRole, ROLE_PERMISSIONS, Permission, RoleName } from './permissions';

export function getRolePermissions(role?: string | null): readonly Permission[] {
  const normalized = normalizeRole(role);
  if (!normalized) return [];
  return ROLE_PERMISSIONS[normalized] ?? [];
}

export function can(user: { role?: string | null } | string | null | undefined, permission: string): boolean {
  if (!permission || typeof permission !== 'string') return false;

  const role = typeof user === 'string' ? user : user?.role;
  const permissions = getRolePermissions(role);
  if (permissions.includes('*')) return true;
  return permissions.includes(permission as Permission);
}

export function canRole(role?: string | null | undefined, permission?: string): boolean {
  if (!permission) return false;
  return can(role ?? null, permission);
}
