import { useQuery } from '@tanstack/react-query';

const parseJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
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

export const useProviderPA = () => {
  return useQuery({
    queryKey: ['provider-pa'],
    queryFn: async () => {
      const res = await fetch('/api/pr/pa-code', { credentials: 'include' });
      const data = await parseJson(res);
      console.debug('useProviderPA response:', res.status, data);
      if (!res.ok) throw new Error((data && (data.message || data.error)) || 'Failed to fetch provider PA data');
      return data;
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
  const data = await parseJson(res);
  console.debug('createProviderPA response:', res.status, data);
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || JSON.stringify(data) || 'Failed to create provider PA';
    throw new Error(msg);
  }
  return data;
}

export default {};
