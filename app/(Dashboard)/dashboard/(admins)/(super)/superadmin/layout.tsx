'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminDashboardUser } from '@/Components/AdminDashboardUserProvider';
import { can } from '@/lib/rbac';
import UnauthorizedPage from './UnauthorizedPage';

const PERMISSION_BY_SEGMENT: Record<string, string> = {
  '': 'overview',
  users: 'users',
  enrollees: 'enrollees',
  clients: 'clients',
  benefits: 'benefits',
  finance: 'finance',
  leads: 'leads',
  coming: 'product',
  tickets: 'tickets',
  employees: 'employees',
  providers: 'providers',
  claims: 'claims',
  reimbursement: 'reimbursement',
  validations: 'validations',
  'pa-code': 'paCodes',
  prescription: 'prescription',
  telemedicine: 'telemedicine',
  'pre-employment': 'preEmployment',
  notification: 'notification',
  roles: 'roles',
  profile: 'profile',
};

function getPermissionForPath(pathname: string | null): string | undefined {
  if (!pathname) return undefined;
  const path = pathname.split('?')[0];
  if (path === '/dashboard/superadmin') return 'overview';

  const segments = path.split('/').filter(Boolean);
  if (segments.length < 3) return undefined;

  const section = segments[2];
  return PERMISSION_BY_SEGMENT[section];
}

export default function SuperadminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useAdminDashboardUser();
  const permission = getPermissionForPath(pathname);
  const currentPathIsSuperadmin = pathname?.startsWith('/dashboard/superadmin');

  if (currentPathIsSuperadmin && permission && !can(user, permission)) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
