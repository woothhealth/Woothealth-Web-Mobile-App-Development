import { cookies } from 'next/headers';

type CurrentUser = {
  id: string | null;
  role: string | null;
  plan: string | null;
  name: string | null;
  lastName: string | null;
  email: string | null;
  company: string | null;
  companyAddress: string | null;
  industry: string | null;
  phone: string | null;
};

type ProviderProfile = {
  id: string | null;
  name: string | null;
  email?: string | null;
  phone?: string | null;
  state?: string | null;
  tier?: string | null;
  address?: string | null;
  remark?: string | null;
  [key: string]: any;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies();
    const cookieArray = (cookieStore.getAll?.() || []);
    const cookieHeader = cookieArray.map((c) => `${c.name}=${c.value}`).join('; ');

    const sessionCookieNames = ['session', 'PHPSESSID', 'phpSession', 'php_session', 'sid', 'connect.sid'];
    const sessionCookie = sessionCookieNames.map((n) => cookieStore.get?.(n)?.value).find(Boolean) || null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/me`, {
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
        company: payload.company || null,
        companyAddress: payload.companyAddress || null,
        plan: payload.plan || null,
        industry: payload.industry || null,
        phone: payload.phone || null,
      };
    }

    // If the backend /api/me failed but we have a session cookie, return a partial user
    if (sessionCookie) {
      return {
        id: sessionCookie,
        role: cookieStore.get?.('role')?.value || null,
        name: null,
        lastName: null,
        email: null,
        company: null,
        companyAddress: null,
        plan: null,
        industry: null,
        phone: null,
      };
    }

    return null;
  } catch (err) {
    return null;
  }
}

export async function getCurrentProvider(): Promise<ProviderProfile | null> {
  try {
    const cookieStore = await cookies();
    const cookieArray = (cookieStore.getAll?.() || []);
    const cookieHeader = cookieArray.map((c) => `${c.name}=${c.value}`).join('; ');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/pr/profile`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      // If backend returned an error but cookies exist, return partial
      const sessionCookie = cookieStore.get?.('session')?.value || cookieStore.get?.('sid')?.value || null;
      if (sessionCookie) return { id: sessionCookie, name: null };
      return null;
    }

    // Normalize payload - accept { success, data }, array, or object
    let payload: any = null;
    if (data && data.success && data.data) payload = data.data;
    else if (Array.isArray(data)) payload = data[0] || null;
    else if (data && data.data && Array.isArray(data.data)) payload = data.data[0] || null;
    // If backend returns { code: 200, data: {...} } unwrap that object too
    else if (data && data.data && typeof data.data === 'object') payload = data.data;
    else payload = data;

    if (!payload) return null;

    return {
      id: payload.id || payload.$id || payload.userId || null,
      name: payload.name || payload.facilityName || payload.providerName || null,
      email: payload.email || null,
      phone: payload.phone || null,
      facilityName: payload.facilityName || null,
      tier: payload.tier || null,
      remark: payload.remarks || null,
      address: payload.address || payload.location || null,
      license: payload.license || payload.licenseNumber || null,
      ...payload,
    } as ProviderProfile;
  } catch (err) {
    console.error('getCurrentProvider error', err);
    return null;
  }
}