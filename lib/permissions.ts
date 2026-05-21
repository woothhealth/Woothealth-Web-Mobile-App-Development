export type RoleName =
  | 'superadmin'
  | 'admin'
  | 'csupport'
  | 'sales'
  | 'finance'
  | 'claims'
  | 'ops'
  | 'underwriting'
  | 'hr';

export type Permission =
  | '*'
  | 'overview'
  | 'profile'
  | 'users'
  | 'enrollees'
  | 'clients'
  | 'benefits'
  | 'finance'
  | 'leads'
  | 'feedback'
  | 'tickets'
  | 'employees'
  | 'providers'
  | 'claims'
  | 'reimbursement'
  | 'validations'
  | 'paCodes'
  | 'prescription'
  | 'telemedicine'
  | 'preEmployment'
  | 'notification'
  | 'roles'
  | 'approvals'
  | 'customerFeeds'
  | 'plans'
  | 'product';

export const ROLE_PERMISSIONS: Record<RoleName, readonly Permission[]> = {
  superadmin: ['*'],
  admin: ['overview', 'profile', 'users', 'enrollees', 'clients', 'benefits', 'finance', 'leads', 'feedback', 'tickets', 'employees', 'providers', 'claims', 'reimbursement', 'validations', 'paCodes', 'prescription', 'telemedicine', 'preEmployment', 'notification', 'roles', 'approvals', 'customerFeeds', 'plans', 'product'],
  csupport: [
    'overview',
    'profile',
    'users',
    'tickets',
    'approvals',
    'customerFeeds',
    'paCodes',
    'telemedicine',
    'prescription',
    'feedback',
    'notification', 'clients', 'validations', 'providers',
  ],
  sales: ['overview', 'profile', 'leads', 'clients', 'enrollees', 'tickets', 'preEmployment', 'providers', 'plans', 'benefits', 'finance', 'reimbursement'],
  finance: ['overview', 'profile', 'finance', 'reimbursement', 'tickets', 'providers'],
  claims: ['overview', 'profile', 'claims', 'reimbursement', 'validations', 'paCodes', 'tickets', 'providers'],
  'ops': ['overview', 'profile', 'providers', 'paCodes', 'prescription', 'reimbursement', 'validations', 'claims', 'tickets'],
  underwriting: ['overview', 'profile', 'plans', 'benefits', 'claims', 'reimbursement', 'validations', 'paCodes', 'tickets', 'providers'],
  hr: ['overview', 'profile', 'employees', 'roles', 'tickets'],
};

export const ROLE_DISPLAY_NAMES: Record<RoleName, string> = {
  superadmin: 'Superadmin',
  admin: 'Admin',
  csupport: 'Support',
  sales: 'Sales',
  finance: 'Finance',
  claims: 'Claims',
  ops: 'Ops',
  underwriting: 'Underwriting',
  hr: 'HR',
};

export type OverviewMetricKey =
  | 'totalUsers'
  | 'totalEnrollees'
  | 'activeClients'
  | 'telemedicineRequests';

export type OverviewCardDefinition = {
  label: string;
  href: string;
  description: string;
  metricKey?: OverviewMetricKey;
  placeholder?: string;
};

export const ROLE_OVERVIEW_CONFIG: Record<
  RoleName,
  {
    title: string;
    subtitle: string;
    cards: OverviewCardDefinition[];
  }
> = {
  superadmin: {
    title: 'Claims Overview',
    subtitle: 'Monitor your health insurance platform performance and claims activity.',
    cards: [
      {
        label: 'Users',
        href: '/dashboard/superadmin/users',
        description: 'Total registered accounts',
        metricKey: 'totalUsers',
      },
      {
        label: 'Enrollees',
        href: '/dashboard/superadmin/enrollees',
        description: 'Members enrolled in active plans',
        metricKey: 'totalEnrollees',
      },
      {
        label: 'Active Clients',
        href: '/dashboard/superadmin/clients',
        description: 'Clients currently using the platform',
        metricKey: 'activeClients',
      },
      {
        label: 'Telemedicine',
        href: '/dashboard/superadmin/telemedicine',
        description: 'Telemedicine request volume',
        metricKey: 'telemedicineRequests',
      },
    ],
  },
  admin: {
    title: 'Admin Overview',
    subtitle: 'Access key metrics and insights to manage your health insurance platform effectively.',
    cards: [
      {
        label: 'Users',
        href: '/dashboard/superadmin/users',
        description: 'Total registered accounts',
        metricKey: 'totalUsers',
      },
      {
        label: 'Enrollees',
        href: '/dashboard/superadmin/enrollees',
        description: 'Members enrolled in active plans',
        metricKey: 'totalEnrollees',
      },
      {
        label: 'Active Clients',
        href: '/dashboard/superadmin/clients',
        description: 'Clients currently using the platform',
        metricKey: 'activeClients',
      },
      {
        label: 'Telemedicine',
        href: '/dashboard/superadmin/telemedicine',
        description: 'Telemedicine request volume',
        metricKey: 'telemedicineRequests',
      },
    ],
  },
  csupport: {
    title: 'Support Overview',
    subtitle: 'Help users quickly by focusing on tickets, PA codes, and customer feedback.',
    cards: [
      {
        label: 'Tickets',
        href: '/dashboard/superadmin/tickets',
        description: 'Open csupport tickets and customer issues',
        placeholder: 'View csupport queue',
      },
      {
        label: 'Users',
        href: '/dashboard/superadmin/users',
        description: 'Registered user accounts',
        metricKey: 'totalUsers',
      },
      {
        label: 'Telemedicine',
        href: '/dashboard/superadmin/telemedicine',
        description: 'Telemedicine cases and follow-ups',
        metricKey: 'telemedicineRequests',
      },
      {
        label: 'PA Codes',
        href: '/dashboard/superadmin/pa-code',
        description: 'Patient authorization code management',
        placeholder: 'Approve or reject codes',
      },
      {
        label: 'Prescription',
        href: '/dashboard/superadmin/prescription',
        description: 'Prescription approvals and history',
        placeholder: 'Manage medication requests',
      },
      {
        label: 'Customer Feeds',
        href: '/dashboard/superadmin/coming',
        description: 'Review customer feedback and suggestions',
        placeholder: 'Monitor user messages',
      },
    ],
  },
  sales: {
    title: 'Sales Overview',
    subtitle: 'Track leads, clients, and enrollee growth in one place.',
    cards: [
      {
        label: 'Leads',
        href: '/dashboard/superadmin/leads',
        description: 'New prospects and pipeline activity',
        placeholder: 'Track lead performance',
      },
      {
        label: 'Clients',
        href: '/dashboard/superadmin/clients',
        description: 'Active client accounts',
        metricKey: 'activeClients',
      },
      {
        label: 'Enrollees',
        href: '/dashboard/superadmin/enrollees',
        description: 'New enrollments and account health',
        metricKey: 'totalEnrollees',
      },
    ],
  },
  finance: {
    title: 'Finance Overview',
    subtitle: 'Monitor financial activity, reimbursements, and claims flow.',
    cards: [
      {
        label: 'Finance',
        href: '/dashboard/superadmin/finance',
        description: 'Platform finance dashboard',
        placeholder: 'View revenue and invoices',
      },
      {
        label: 'Reimbursement',
        href: '/dashboard/superadmin/reimbursement',
        description: 'Claims and payment processing',
        placeholder: 'Manage reimbursement requests',
      },
      {
        label: 'Claims',
        href: '/dashboard/superadmin/claims',
        description: 'Claims volume and status updates',
        placeholder: 'Review active claims',
      },
    ],
  },
  claims: {
    title: 'Claims Overview',
    subtitle: 'Review claims, validations, and reimbursement metrics.',
    cards: [
      {
        label: 'Claims',
        href: '/dashboard/superadmin/claims',
        description: 'Claims in review and processing',
        placeholder: 'Inspect claim workflows',
      },
      {
        label: 'Reimbursement',
        href: '/dashboard/superadmin/reimbursement',
        description: 'Approved reimbursements',
        placeholder: 'Track payment status',
      },
      {
        label: 'Validations',
        href: '/dashboard/superadmin/validations',
        description: 'Validation tasks and approvals',
        placeholder: 'Review validation work',
      },
      {
        label: 'PA Codes',
        href: '/dashboard/superadmin/pa-code',
        description: 'Prior authorization management',
        placeholder: 'Manage PA requests',
      },
    ],
  },
  'ops': {
    title: 'Ops Overview',
    subtitle: 'Manage provider network access and provider details.',
    cards: [
      {
        label: 'Providers',
        href: '/dashboard/superadmin/providers',
        description: 'Provider network and details',
        placeholder: 'Manage provider records',
      },
    ],
  },
  underwriting: {
    title: 'Underwriting Overview',
    subtitle: 'Manage plans, benefits, and product configuration.',
    cards: [
      {
        label: 'Plans',
        href: '/dashboard/superadmin/benefits',
        description: 'Policy plans and coverage products',
        placeholder: 'Configure plan benefits',
      },
      {
        label: 'Benefits',
        href: '/dashboard/superadmin/benefits',
        description: 'Benefit packages and approvals',
        placeholder: 'Review benefit designs',
      },
    ],
  },
  hr: {
    title: 'HR Overview',
    subtitle: 'Review employee directories, roles, and HR data.',
    cards: [
      {
        label: 'Employees',
        href: '/dashboard/superadmin/employees',
        description: 'Employee directory and HR records',
        placeholder: 'Review employee data',
      },
      {
        label: 'Roles',
        href: '/dashboard/superadmin/roles',
        description: 'Access control and role management',
        placeholder: 'Manage role assignments',
      },
    ],
  },
};

export function normalizeRole(role?: string | null): RoleName | null {
  if (!role) return null;
  const normalized = role.toString().trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  const knownRoles: Record<string, RoleName> = {
    superadmin: 'superadmin',
    csupport: 'csupport',
    support: 'csupport',
    'customer support': 'csupport',
    sales: 'sales',
    finance: 'finance',
    claims: 'claims',
    ops: 'ops',
    'provider ops': 'ops',
    underwriting: 'underwriting',
    hr: 'hr',
    'human resources': 'hr',
    administrator: 'admin',
    admin: 'admin',
  };
  return knownRoles[normalized] ?? null;
}
