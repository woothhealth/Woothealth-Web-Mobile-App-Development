import { cookies } from 'next/headers';

type ProviderUser = {
  id: string | null;
  role: string | null;
  name: string | null;
  email?: string | null;
  phone?: string | null;
  [k: string]: any;
};

export async function getProviderUser(): Promise<ProviderUser | null> {
  try {
    const cookieStore = await cookies();
    const cookieArray = (cookieStore.getAll?.() || []);
    const cookieHeader = cookieArray.map((c) => `${c.name}=${c.value}`).join('; ');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/pr/profile`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const payload = (data && data.success && data.data) ? data.data : data;
      return {
        id: payload.userId || payload.$id || payload.id || null,
        role: payload.role || cookieStore.get?.('role')?.value || null,
        name: payload.name || payload.displayName || payload.fullName || null,
        email: payload.email || null,
        phone: payload.phone || null,
        ...payload,
      };
    }

    return null;
  } catch (err) {
    return null;
  }
}
