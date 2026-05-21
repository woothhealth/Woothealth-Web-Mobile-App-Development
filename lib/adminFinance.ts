import { useQuery } from '@tanstack/react-query';
import type { Invoice } from '@/app/(Dashboard)/dashboard/(admins)/(super)/superadmin/finance/mock-finance';

export type AdminInvoice = Invoice;

export const useAdminFinance = () => {
  return useQuery({
    queryKey: ['admin-finance'],
    queryFn: async () => {
      const res = await fetch('/api/admin/finance');
      if (!res.ok) throw new Error('Failed to fetch admin finance');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export async function createAdminFinance(payload: any) {
  const res = await fetch('/api/admin/finance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
    throw new Error(`Failed to create invoice: ${errMsg}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function updateAdminFinance(invoiceId: string, payload: any) {
  const res = await fetch(`/api/admin/finance?invoiceId=${encodeURIComponent(invoiceId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
    throw new Error(`Failed to update invoice: ${errMsg}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function deleteAdminFinance(invoiceId: string) {
  const res = await fetch(`/api/admin/finance?invoiceId=${encodeURIComponent(invoiceId)}`, {
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
    throw new Error(`Failed to delete invoice: ${errMsg}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
