import { useQuery } from '@tanstack/react-query';

export type AdminBenefit = {
  plan_id: string;
  plan_name: string;
  category: string;
  source: string;
  plan_limit: string;
  benefits: string[];
  coverage: string[];
  coverage_limit: string[];
  $id: string;
  [key: string]: any;
};

export const useAdminBenefits = () => {
  return useQuery({
    queryKey: ['admin-benefits'],
    queryFn: async () => {
      const res = await fetch('/api/admin/benefits');
      if (!res.ok) throw new Error('Failed to fetch admin benefits');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export async function createAdminBenefit(payload: any) {
  const res = await fetch('/api/admin/benefits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create benefit');
  return res.json();
}

export async function updateAdminBenefit(benefitId: string, payload: any) {
  const res = await fetch(`/api/admin/benefits?benefitId=${encodeURIComponent(benefitId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update benefit');
  return res.json();
}

export async function deleteAdminBenefit(benefitId: string) {
  const res = await fetch(`/api/admin/benefits?benefitId=${encodeURIComponent(benefitId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete benefit');
  return res.json();
}
