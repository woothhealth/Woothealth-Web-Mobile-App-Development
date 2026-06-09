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

  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch (e) {
    // leave as text
  }

  // Some backends return 201 but include a failure payload (e.g. { success: false }).
  if (res.status === 201 && data && typeof data === 'object' && data.success === false) {
    const err = data.message || data.error || JSON.stringify(data);
    throw new Error(`Failed to create plan (201): ${err}`);
  }

  if (!res.ok) {
    const errMsg = (data && typeof data === 'object') ? (data.message || data.error || JSON.stringify(data)) : text || res.statusText;
    throw new Error(`Failed to create plan: ${errMsg}`);
  }

  return data;
}

export async function updateAdminPlan(planId: string, payload: any) {
  const res = await fetch(`/api/admin/plans?planId=${encodeURIComponent(planId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const text = await res.text();
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch (e) {
    // leave as text
  }

  // Handle success:false payloads even on 200
  if (res.status === 200 && data && typeof data === 'object' && data.success === false) {
    const err = data.message || data.error || JSON.stringify(data);
    throw new Error(`Failed to update plan (200): ${err}`);
  }

  if (!res.ok) {
    const errMsg = (data && typeof data === 'object') ? (data.message || data.error || JSON.stringify(data)) : text || res.statusText;
    throw new Error(`Failed to update plan: ${errMsg}`);
  }

  return data;
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
