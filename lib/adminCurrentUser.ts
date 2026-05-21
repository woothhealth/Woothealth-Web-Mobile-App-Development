import { cookies } from 'next/headers';
import { normalizeRole } from './permissions';
import { DASHBOARD_ADMIN_ROLES } from './roles';

type AdminUser = {
  id: string | null;
  role: string | string[] | null; // Support both single role and array of roles
  primaryRole: string | null; // The main role to use for UI logic
  name: string | null;
  lastName: string | null;
  email: string | null;
  phone?: string;
  status?: string;
};

/**
 * Determine the primary role from multiple roles
 * Prioritizes admin roles over regular roles for dashboard access
 */
function getPrimaryRole(roles: string | string[] | null): string | null {
  if (!roles) return null;
  
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  // First, check for admin roles (these take priority for dashboard access)
  for (const role of roleArray) {
    const normalized = normalizeRole(role);
    if (normalized && DASHBOARD_ADMIN_ROLES.includes(normalized)) {
      return role; // Return the original role string, not normalized
    }
  }
  
  // If no admin roles, return the first role
  return roleArray[0] || null;
}

export async function getAdminCurrentUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const cookieArray = (cookieStore.getAll?.() || []);
    const cookieHeader = cookieArray.map((c) => `${c.name}=${c.value}`).join('; ');

    const sessionCookieNames = ['session', 'PHPSESSID', 'phpSession', 'php_session', 'sid', 'connect.sid'];
    const sessionCookie = sessionCookieNames.map((n) => cookieStore.get?.(n)?.value).find(Boolean) || null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/admin/profile`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      // Support wrapped envelope { success: true, data: { ... } }
      const payload = (data && data.success && data.data) ? data.data : data;

      const computedRole = getPrimaryRole(payload.role || payload.roles);
      return {
        id: payload.userId || payload.$id || payload.id || sessionCookie || null,
        role: computedRole || payload.role || payload.roles || cookieStore.get?.('role')?.value || null,
        primaryRole: computedRole,
        name:
          payload.firstName || payload.first_name || payload.name || payload.fullName || (payload.email ? String(payload.email).split('@')[0] : null) || null,
        lastName: payload.lastName || payload.last_name || null,
        email: payload.email || null,
      };
    }

    // If the backend /api/admin/profile failed but we have a session cookie, return a partial user
    if (sessionCookie) {
      const roleValue = cookieStore.get?.('role')?.value ?? null;
      return {
        id: sessionCookie,
        role: roleValue,
        primaryRole: getPrimaryRole(roleValue),
        name: null,
        lastName: null,
        email: null,
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to get admin current user:', error);
    return null;
  }
}