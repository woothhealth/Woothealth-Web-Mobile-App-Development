import { RoleName } from './permissions';

/**
 * Roles that have access to the admin/dashboard
 */
export const DASHBOARD_ADMIN_ROLES: readonly RoleName[] = [
  'superadmin',
  'admin',
  'sales',
  'claims',
  'underwriting',
  'csupport',
  'ops',
  'finance',
  'hr',
];

/**
 * Map roles to their dashboard entry paths
 */
export const ROLE_DASHBOARD_PATHS: Record<RoleName, string> = {
  superadmin: '/dashboard/superadmin',
  admin: '/dashboard/superadmin',
  csupport: '/dashboard/superadmin',
  sales: '/dashboard/superadmin',
  finance: '/dashboard/superadmin',
  claims: '/dashboard/superadmin',
  ops: '/dashboard/superadmin',
  underwriting: '/dashboard/superadmin',
  hr: '/dashboard/superadmin',
};

/**
 * Check if a role has dashboard access
 */
export function hasDashboardAccess(role?: string | null): boolean {
  if (!role) return false;
  return DASHBOARD_ADMIN_ROLES.includes(role as RoleName);
}

/**
 * Get the dashboard redirect path for a role
 */
export function getDashboardPath(role?: string | null): string {
  if (!role || !hasDashboardAccess(role)) {
    return '/admin';
  }
  return ROLE_DASHBOARD_PATHS[role as RoleName] || '/dashboard/superadmin';
}
