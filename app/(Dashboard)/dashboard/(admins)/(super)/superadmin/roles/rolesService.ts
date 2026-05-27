export type Role = {
  id: string;
  name: string;
  description?: string;
  totalUsers?: number;
  users?: Array<{ id: string; name: string; email: string; status?: string }>;
  moduleAccess?: any[];
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchRoles(opts?: { page?: number; limit?: number }) {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 100;
  const res = await fetch(`/api/admin/role?page=${page}&limit=${limit}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch roles');
  const json = await res.json();
  return json?.data || [];
}

export async function fetchRole(id: string) {
  const res = await fetch(`/api/admin/role?id=${encodeURIComponent(id)}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch role');
  const json = await res.json();
  return json?.data || null;
}

export function computeRoleStats(roles: Role[] | undefined) {
  const list = roles || [];
  const totalRoles = list.length;
  const totalUsers = list.reduce((sum, r) => sum + (r.totalUsers ?? (r.users ? r.users.length : 0)), 0);
  const byName: Record<string, number> = {};
  for (const r of list) {
    byName[r.name] = (byName[r.name] || 0) + (r.totalUsers ?? (r.users ? r.users.length : 0));
  }
  return { totalRoles, totalUsers, byName, roles: list };
}
