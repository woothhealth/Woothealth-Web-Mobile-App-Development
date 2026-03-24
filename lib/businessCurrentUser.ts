import { cookies } from 'next/headers';

type BusinessUser = {
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
  businessName: string | null;
  taxId: string | null;
  subscriptionStatus: string | null;
};

export async function getBusinessCurrentUser(): Promise<BusinessUser | null> {
  try {
    const cookieStore = await cookies();
    const cookieArray = (cookieStore.getAll?.() || []);
    const cookieHeader = cookieArray.map((c) => `${c.name}=${c.value}`).join('; ');

    const sessionCookieNames = ['session', 'PHPSESSID', 'phpSession', 'php_session', 'sid', 'connect.sid'];
    const sessionCookie = sessionCookieNames.map((n) => cookieStore.get?.(n)?.value).find(Boolean) || null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/business/profile`, {
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
        company: payload.company || payload.businessName || null,
        companyAddress: payload.companyAddress || payload.address || null,
        plan: payload.plan || payload.planType || null,
        industry: payload.industry || null,
        phone: payload.phone || null,
        businessName: payload.businessName || payload.company || null,
        taxId: payload.taxId || payload.regNumber || null,
        subscriptionStatus: payload.subscriptionStatus || null,
      };
    }

    // If the backend /api/business/profile failed but we have a session cookie, return a partial user
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
        businessName: null,
        taxId: null,
        subscriptionStatus: null,
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to get business current user:', error);
    return null;
  }
}