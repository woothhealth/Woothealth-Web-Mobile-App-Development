import { getAdminHeaders } from '@/lib/adminGuard';

export const parseRawResponse = async (res: Response) => {
  const raw = await res.text();
  try { return JSON.parse(raw); } catch { return raw; }
};

export const buildBackendUrl = (base: string, opts: { admin?: boolean, id?: string, page?: string, limit?: string }) => {
  const { admin, id, page, limit } = opts;
  let target = id ? `${base}${admin ? '/admin/notifications' : '/notifications'}/${id}` : `${base}${admin ? '/admin/notifications' : '/notifications'}/`;
  const params = new URLSearchParams();
  if (!id) {
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
  }
  const qs = params.toString();
  if (qs) target += `?${qs}`;
  return target;
};

export const makeAdminTitle = (n: any) => {
  const type = (n.notificationType || n.type || '').toString().toLowerCase();
  const msg = (n.message || n.originalMessage || '').toString();
  if (type.includes('push') && /session|appointment|appointment request/i.test(msg)) {
    return `${n.userId ?? 'Unknown'} · New session request`;
  }
  if (/pre-?employment|test/i.test(msg)) return `${n.userId ?? 'Unknown'} · Pre-employment test`;
  if (n.title) return n.title;
  return msg ? (msg.length > 80 ? msg.slice(0, 77) + '...' : msg) : 'Notification';
};

export const mapItemsForAdmin = (items: any[]) => items.map((n) => ({
  ...n,
  originalMessage: n.message ?? n.originalMessage ?? '',
  title: makeAdminTitle(n),
}));

export const getForwardedHeaders = (cookieHeader: string, admin?: boolean) => {
  if (admin) return { ...getAdminHeaders(cookieHeader) } as Record<string,string>;
  return cookieHeader ? { Cookie: cookieHeader } as Record<string,string> : {};
};
