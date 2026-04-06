import { cookies } from 'next/headers';

type AdminUser = {
  id: string | null;
  role: string | null;
  name: string | null;
  lastName: string | null;
  email: string | null;
};

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

      return {
        id: payload.userId || payload.$id || payload.id || sessionCookie || null,
        role: payload.role || cookieStore.get?.('role')?.value || null,
        name:
          payload.firstName || payload.first_name || payload.name || payload.fullName || (payload.email ? String(payload.email).split('@')[0] : null) || null,
        lastName: payload.lastName || payload.last_name || null,
        email: payload.email || null,
      };
    }

    // If the backend /api/admin/profile failed but we have a session cookie, return a partial user
    if (sessionCookie) {
      return {
        id: sessionCookie,
        role: cookieStore.get?.('role')?.value || null,
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