import { useQuery } from '@tanstack/react-query';

export type ProviderUserProfile = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  specialty?: string;
  status?: string;
  [k: string]: any;
};

const parseError = async (res: Response, fallbackMessage: string) => {
  const text = await res.text();
  let errMsg = text || res.statusText || fallbackMessage;
  try {
    const json = JSON.parse(text);
    errMsg = json.message || json.error || JSON.stringify(json) || errMsg;
  } catch {
    // keep original text
  }
  throw new Error(errMsg);
};

export const useProviderProfiles = () => {
  return useQuery({
    queryKey: ['provider-profiles'],
    queryFn: async () => {
      const res = await fetch('/api/pr/profile', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch provider profiles');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProviderProfile = (profileId?: string) => {
  return useQuery({
    queryKey: ['provider-profile', profileId],
    enabled: Boolean(profileId),
    queryFn: async () => {
      if (!profileId) throw new Error('Profile id is required');
      const res = await fetch(`/api/pr/profile?id=${encodeURIComponent(profileId)}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch provider profile');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export async function createProviderProfile(payload: any) {
  const res = await fetch('/api/pr/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) await parseError(res, 'Failed to create provider profile');
  return res.json();
}

export async function updateProviderProfile(profileId: string, payload: any) {
  const res = await fetch(`/api/pr/profile?id=${encodeURIComponent(profileId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) await parseError(res, 'Failed to update provider profile');
  return res.json();
}

export async function deleteProviderProfile(profileId: string) {
  const res = await fetch(`/api/pr/profile?id=${encodeURIComponent(profileId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) await parseError(res, 'Failed to delete provider profile');
  return res.json();
}
