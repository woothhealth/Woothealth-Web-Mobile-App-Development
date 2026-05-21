import { normalizeRole, ROLE_PERMISSIONS, Permission, RoleName } from './permissions';

type UserWithRoleFields = {
  role?: string | null;
  roles?: string[] | string | null;
};

type UserWithRole = UserWithRoleFields | string | string[] | null | undefined;

function normalizeRoleValue(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap(normalizeRoleValue);
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function getRolePermissions(role?: string | string[] | null): readonly Permission[] {
  const roles = normalizeRoleValue(role);
  const permissions = roles.flatMap((r) => {
    const normalized = normalizeRole(r);
    return normalized ? ROLE_PERMISSIONS[normalized] ?? [] : [];
  });

  return Array.from(new Set(permissions)) as readonly Permission[];
}

function getUserRoles(user: UserWithRole): string[] {
  if (!user) return [];
  if (typeof user === 'string') return [user];
  if (Array.isArray(user)) return normalizeRoleValue(user);

  const fromRole = normalizeRoleValue(user.role);
  const fromRoles = normalizeRoleValue(user.roles);
  return Array.from(new Set([...fromRole, ...fromRoles]));
}

export function can(user: UserWithRole, permission: string): boolean {
  if (!permission || typeof permission !== 'string') return false;

  const roles = getUserRoles(user);
  const permissions = getRolePermissions(roles);
  const hasPermission = permissions.includes('*') || permissions.includes(permission as Permission);

  return hasPermission;
}

export function canRole(role?: string | string[] | null | undefined, permission?: string): boolean {
  if (!permission) return false;
  return can(role ?? null, permission);
}
