import { useQuery } from '@tanstack/react-query';

export type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
};

export const departments = ['Finance', 'IT', 'HR', 'Sales', 'Operations', 'Marketing'];
export const employeeRoles = ['Manager', 'Developer', 'Recruiter', 'Executive', 'Coordinator', 'Specialist', 'Analyst', 'Support', 'Assistant', 'Representative', 'Supervisor', 'Designer'];
export const employeeStatuses: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];

const parseJson = async (res: Response) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const useAdminEmployees = () => {
  return useQuery({
    queryKey: ['admin-employees'],
    queryFn: async () => {
      const res = await fetch('/api/admin/employee', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch admin employees');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminEmployee = (employeeId?: string) => {
  return useQuery({
    queryKey: ['admin-employee', employeeId],
    enabled: Boolean(employeeId),
    queryFn: async () => {
      if (!employeeId) throw new Error('Employee id is required');
      const res = await fetch(`/api/admin/employee?employeeId=${encodeURIComponent(employeeId)}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch admin employee');
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

export async function createAdminEmployee(payload: any) {
  const res = await fetch('/api/admin/employee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) {
    await parseError(res, 'Failed to create employee');
  }
  return res.json();
}

export async function updateAdminEmployee(employeeId: string, payload: any) {
  const res = await fetch(`/api/admin/employee?employeeId=${encodeURIComponent(employeeId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) {
    await parseError(res, 'Failed to update employee');
  }
  return res.json();
}

export async function deleteAdminEmployee(employeeId: string) {
  const res = await fetch(`/api/admin/employee?employeeId=${encodeURIComponent(employeeId)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    await parseError(res, 'Failed to delete employee');
  }
  return res.json();
}
