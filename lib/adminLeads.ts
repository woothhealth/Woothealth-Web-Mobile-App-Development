import { useQuery } from '@tanstack/react-query';

export type LeadStatus = 'New Lead' | 'Contacted' | 'Converted' | 'Lost';

export type Lead = {
  id: string;
  clientName: string;
  clientType: string;
  email: string;
  phone: string;
  contactPerson: string;
  potentialEmployees: number;
  assignedTo: string;
  logNote: string;
  status: LeadStatus;
  dateAdded: string;
};

export const clientTypes = ['Corporate', 'SMB', 'Enterprise', 'Individual'];
export const salesReps = ['Amina Musa', 'Tunde Ade', 'Chioma Eze', 'Kemi Oladipo'];
export const leadStatuses: LeadStatus[] = ['New Lead', 'Contacted', 'Converted', 'Lost'];

const parseJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const useAdminLeads = () => {
  return useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const res = await fetch('/api/admin/leads', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch admin leads');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminLead = (leadId?: string) => {
  return useQuery({
    queryKey: ['admin-lead', leadId],
    enabled: Boolean(leadId),
    queryFn: async () => {
      if (!leadId) throw new Error('Lead id is required');
      const res = await fetch(`/api/admin/leads?leadId=${encodeURIComponent(leadId)}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch admin lead');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
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

export async function createAdminLead(payload: any) {
  const res = await fetch('/api/admin/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) {
    await parseError(res, 'Failed to create lead');
  }
  return res.json();
}

export async function updateAdminLead(leadId: string, payload: any) {
  const res = await fetch(`/api/admin/leads?leadId=${encodeURIComponent(leadId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) {
    await parseError(res, 'Failed to update lead');
  }
  return res.json();
}

export async function deleteAdminLead(leadId: string) {
  const res = await fetch(`/api/admin/leads?leadId=${encodeURIComponent(leadId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    await parseError(res, 'Failed to delete lead');
  }
  return res.json();
}
