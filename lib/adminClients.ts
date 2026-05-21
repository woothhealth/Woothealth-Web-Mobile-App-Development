import { useQuery } from '@tanstack/react-query';

export const useAdminClients = () => {
  return useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const res = await fetch('/api/admin/clients');
      if (!res.ok) throw new Error('Failed to fetch admin clients');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export async function createAdminClient(payload: any) {
  const res = await fetch('/api/admin/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create client');
  return res.json();
}

export async function updateAdminClient(clientId: string, payload: any) {
  const url = `/api/admin/clients?clientId=${encodeURIComponent(clientId)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update client');
  return res.json();
}

export async function deleteAdminClient(clientId: string) {
  const url = `/api/admin/clients?clientId=${encodeURIComponent(clientId)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete client');
  return res.json();
}
