import { useQuery } from '@tanstack/react-query';

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

export const useProviderPA = () => {
  return useQuery({
    queryKey: ['provider-pa'],
    queryFn: async () => {
      const res = await fetch('/api/pr/pa-code', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch provider PA data');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export async function createProviderPA(payload: any) {
  const res = await fetch('/api/pr/pa-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    await parseError(res, 'Failed to create provider PA');
  }
  return res.json();
}

export default {};
