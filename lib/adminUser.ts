import { DASHBOARD_ADMIN_ROLES } from './roles';

export type AdminUser = {
  $id?: string;
  userId?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  status?: string;
  providerName?: string;
  plan?: string | null;
  [key: string]: any;
};

export async function getAdminUserById(userId: string): Promise<AdminUser | null> {
  if (!userId) {
    return null;
  }

  try {
    const res = await fetch(`/api/admin/user?userId=${encodeURIComponent(userId)}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.debug('GET /api/admin/user returned non-ok status', { status: res.status });
      return null;
    }

    const data = await res.json();
    // log the backend response for debugging
    console.debug('GET /api/admin/user response:', data);
    const payload = data?.data ?? data;

    if (!payload) {
      return null;
    }

    if (Array.isArray(payload)) {
      return payload.find(
        (user: any) => user.userId === userId || user.$id === userId || user.id === userId
      ) || null;
    }

    return payload as AdminUser;
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }
}

export async function getAdminUsersCount(roles: string[] = DASHBOARD_ADMIN_ROLES as unknown as string[]): Promise<number> {
  try {
    const res = await fetch(`/api/admin/user?limit=1000`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) {
      console.debug('GET /api/admin/user returned non-ok status when counting admins', { status: res.status });
      return 0;
    }

    const data = await res.json();
    const payload = data?.data ?? data;
    const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.items) ? payload.items : []);

    const normalizedRoles = (roles || []).map((r) => String(r).toLowerCase());

    const count = list.reduce((acc: number, u: any) => {
      const role = (u?.role || u?.roleName || '').toString().toLowerCase();
      return acc + (normalizedRoles.includes(role) ? 1 : 0);
    }, 0);

    return count;
  } catch (err) {
    console.error('Error counting admin users', err);
    return 0;
  }
}

export async function updateAdminUser(payload: Record<string, any>): Promise<any> {
  if (!payload || (typeof payload !== 'object')) throw new Error('Invalid payload');

  // Ensure identifier present
  const id = payload.id || payload.userId || payload.$id || payload.id;
  if (!id) throw new Error('userId is required for update.');

  // Build body: include id and userId if available
  const body: Record<string, any> = { ...(payload || {}) };

  // Normalize helper (same as ActionButtonsHandler)
  const normalizeGender = (g: any) => {
    if (g === null || g === undefined) return g;
    const s = String(g).toLowerCase().trim();
    if (s === 'male' || s === 'm') return 'male';
    if (s === 'female' || s === 'f') return 'female';
    if (s === 'non-binary' || s === 'nonbinary' || s === 'non binary' || s === 'nb') return 'non-binary';
    if (s === 'other' || s === 'others') return 'others';
    return s;
  };

  // Map dob -> dateOfBirth if present
  if (body.dob) {
    body.dateOfBirth = body.dob;
    delete body.dob;
  }

  // If hmoId provided, also set userId for compatibility
  if (body.hmoId && !body.userId) {
    body.userId = body.hmoId;
  }

  // Normalize gender in place
  if (body.gender !== undefined && body.gender !== null) {
    body.gender = normalizeGender(body.gender);
  }

  // Convert numeric-like fields
  if (body.dependants !== undefined && body.dependants !== null) {
    const n = Number(body.dependants);
    if (!Number.isNaN(n)) body.dependants = n;
  }

  // Strip empty string fields and undefined/null
  Object.keys(body).forEach((k) => {
    const v = body[k];
    if (v === undefined || v === null) {
      delete body[k];
      return;
    }
    if (typeof v === 'string' && v.trim() === '') {
      delete body[k];
      return;
    }
  });

  // Ensure id/userId present in body
  if (!body.id) body.id = id;
  if (!body.userId && payload.userId) body.userId = payload.userId;

  // Build forward body expected by backend: include top-level ids and a `data` object
  const dataFields: Record<string, any> = { ...body };
  delete dataFields.id;
  delete dataFields.userId;

  const forwardBody: Record<string, any> = {};
  if (body.id) forwardBody.id = body.id;
  if (body.userId) forwardBody.userId = body.userId;
  // include userId inside data as some backends expect it there
  forwardBody.data = { ...(body.userId ? { userId: body.userId } : {}), ...dataFields };

  const res = await fetch('/api/admin/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(forwardBody),
  });

  const text = await res.text().catch(() => '');
  let parsed: any = {};
  try { parsed = JSON.parse(text); } catch { parsed = { error: text }; }

  if (!res.ok) {
    // Log full response and request body for debugging validation errors
    console.error('updateAdminUser: backend error', { status: res.status, response: parsed, requestBody: forwardBody });
    const errMsg = parsed?.message || parsed?.error || `Request failed (${res.status})`;
    const e: any = new Error(errMsg);
    e.status = res.status;
    e.body = parsed;
    throw e;
  }

  return parsed?.data ?? parsed;
}
