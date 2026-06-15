import { useQuery } from '@tanstack/react-query';

export type TicketStatus = 'open' | 'In progress' | 'resolved';

export type Ticket = {
  id: string;
  date: string;
  title: string;
  department: string;
  status: TicketStatus;
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

export const useAdminTickets = () => {
  return useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      const res = await fetch('/api/admin/tickets', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch admin tickets');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export async function createAdminTicket(payload: any) {
  console.debug('createAdminTicket: sending payload to /api/admin/tickets', payload);
  const res = await fetch('/api/admin/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  let text = null;
  try {
    text = await res.clone().text();
  } catch (e) {
    console.debug('createAdminTicket: failed to read response text', e);
  }
  console.debug('createAdminTicket: response status=', res.status, 'body=', text);
  if (!res.ok) {
    await parseError(res, 'Failed to create ticket');
  }
  return res.json();
}

export async function updateAdminTicket(ticketId: string, payload: any) {
  const res = await fetch(`/api/admin/tickets?ticketId=${encodeURIComponent(ticketId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) {
    await parseError(res, 'Failed to update ticket');
  }
  return res.json();
}

export async function deleteAdminTicket(ticketId: string) {
  const res = await fetch(`/api/admin/tickets?ticketId=${encodeURIComponent(ticketId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    await parseError(res, 'Failed to delete ticket');
  }
  return res.json();
}
