import { useQuery } from '@tanstack/react-query';

export type AdminPlan = {
  name: string;
  description: string;
  amount: number;
  planType: string;
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  [key: string]: any;
};

export const useAdminPlans = () => {
  return useQuery({
    queryKey: ['admin-plans'],
    queryFn: async () => {
      const res = await fetch('/api/admin/plans');
      if (!res.ok) throw new Error('Failed to fetch admin plans');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export async function createAdminPlan(payload: any) {
  const res = await fetch('/api/admin/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create plan');
  return res.json();
}

export async function updateAdminPlan(planId: string, payload: any) {
  const res = await fetch(`/api/admin/plans?planId=${encodeURIComponent(planId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update plan');
  return res.json();
}

export async function deleteAdminPlan(planId: string) {
  const res = await fetch(`/api/admin/plans?planId=${encodeURIComponent(planId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const text = await res.text();
  if (!res.ok) {
    let errMsg = text || res.statusText || 'Unknown error';
    try {
      const json = JSON.parse(text);
      errMsg = json.message || json.error || JSON.stringify(json) || errMsg;
    } catch (e) {
      // keep text
    }
    throw new Error(`Failed to delete plan: ${errMsg}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}
