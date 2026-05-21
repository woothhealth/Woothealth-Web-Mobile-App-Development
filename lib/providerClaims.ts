import { useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useProviderClaims = () => {
  return useQuery({
    queryKey: ['provider-claims'],
    queryFn: async () => {
      const res = await fetch('/api/pr/claims', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch provider claims');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export async function createProviderClaim(payload: any) {
  const res = await fetch('/api/pr/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    await parseError(res, 'Failed to create provider claim');
  }
  return res.json();
}

export default {};
