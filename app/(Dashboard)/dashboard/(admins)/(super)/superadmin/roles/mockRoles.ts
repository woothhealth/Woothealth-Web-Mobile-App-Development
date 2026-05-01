export interface Role {
  id: string;
  name: string;
  description: string;
  totalUsers: number;
  users: Array<{
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
  }>;
  moduleAccess: ModuleAccess[];
  createdAt: string;
  updatedAt: string;
}

export interface ModuleAccess {
  module: string;
  permissions: Permission[];
}

export interface Permission {
  name: 'VIEW' | 'CREATE' | 'EDIT' | 'ACCEPT' | 'REJECT';
  enabled: boolean;
}

export const MODULES = [
  'underwriting',
  'support',
  'claims officer',
  'provider',
  'sales',
  'account manager',
  'finance',
  'telemedicine',
  'prescription',
  'pre-employment',
  'benefits',
  'reimbursement',
  'tickets',
  'leads',
  'clients',
  'employees',
  'enrollees',
  'users',
  'profile',
  'overview'
];

export const PERMISSIONS: Permission['name'][] = ['VIEW', 'CREATE', 'EDIT', 'ACCEPT', 'REJECT'];

export const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Super Admin',
    description: 'Full access to all system features and administrative functions',
    totalUsers: 3,
    users: [
      { id: 'user-1', name: 'John Admin', email: 'john@woothealth.com', status: 'active' },
      { id: 'user-2', name: 'Sarah Admin', email: 'sarah@woothealth.com', status: 'active' },
      { id: 'user-3', name: 'Mike Admin', email: 'mike@woothealth.com', status: 'inactive' }
    ],
    moduleAccess: MODULES.map(module => ({
      module,
      permissions: PERMISSIONS.map(permission => ({
        name: permission,
        enabled: true
      }))
    })),
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'role-2',
    name: 'Claims Officer',
    description: 'Handles claims processing and management',
    totalUsers: 8,
    users: [
      { id: 'user-4', name: 'Alice Claims', email: 'alice@woothealth.com', status: 'active' },
      { id: 'user-5', name: 'Bob Claims', email: 'bob@woothealth.com', status: 'active' },
      { id: 'user-6', name: 'Carol Claims', email: 'carol@woothealth.com', status: 'active' },
      { id: 'user-7', name: 'David Claims', email: 'david@woothealth.com', status: 'active' },
      { id: 'user-8', name: 'Eva Claims', email: 'eva@woothealth.com', status: 'active' },
      { id: 'user-9', name: 'Frank Claims', email: 'frank@woothealth.com', status: 'inactive' },
      { id: 'user-10', name: 'Grace Claims', email: 'grace@woothealth.com', status: 'active' },
      { id: 'user-11', name: 'Henry Claims', email: 'henry@woothealth.com', status: 'active' }
    ],
    moduleAccess: [
      {
        module: 'claims',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: true },
          { name: 'EDIT', enabled: true },
          { name: 'ACCEPT', enabled: true },
          { name: 'REJECT', enabled: true }
        ]
      },
      {
        module: 'support',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: false },
          { name: 'EDIT', enabled: false },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      },
      {
        module: 'overview',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: false },
          { name: 'EDIT', enabled: false },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      }
    ],
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 'role-3',
    name: 'Sales Manager',
    description: 'Manages sales team and leads',
    totalUsers: 5,
    users: [
      { id: 'user-12', name: 'Ivy Sales', email: 'ivy@woothealth.com', status: 'active' },
      { id: 'user-13', name: 'Jack Sales', email: 'jack@woothealth.com', status: 'active' },
      { id: 'user-14', name: 'Kate Sales', email: 'kate@woothealth.com', status: 'active' },
      { id: 'user-15', name: 'Liam Sales', email: 'liam@woothealth.com', status: 'inactive' },
      { id: 'user-16', name: 'Mia Sales', email: 'mia@woothealth.com', status: 'active' }
    ],
    moduleAccess: [
      {
        module: 'sales',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: true },
          { name: 'EDIT', enabled: true },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      },
      {
        module: 'leads',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: true },
          { name: 'EDIT', enabled: true },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      },
      {
        module: 'clients',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: true },
          { name: 'EDIT', enabled: false },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      },
      {
        module: 'overview',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: false },
          { name: 'EDIT', enabled: false },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      }
    ],
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  },
  {
    id: 'role-4',
    name: 'Provider Support',
    description: 'Supports healthcare providers with system access',
    totalUsers: 6,
    users: [
      { id: 'user-17', name: 'Nina Provider', email: 'nina@woothealth.com', status: 'active' },
      { id: 'user-18', name: 'Oscar Provider', email: 'oscar@woothealth.com', status: 'active' },
      { id: 'user-19', name: 'Paul Provider', email: 'paul@woothealth.com', status: 'active' },
      { id: 'user-20', name: 'Quinn Provider', email: 'quinn@woothealth.com', status: 'inactive' },
      { id: 'user-21', name: 'Rose Provider', email: 'rose@woothealth.com', status: 'active' },
      { id: 'user-22', name: 'Sam Provider', email: 'sam@woothealth.com', status: 'active' }
    ],
    moduleAccess: [
      {
        module: 'provider',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: true },
          { name: 'EDIT', enabled: true },
          { name: 'ACCEPT', enabled: true },
          { name: 'REJECT', enabled: false }
        ]
      },
      {
        module: 'telemedicine',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: false },
          { name: 'EDIT', enabled: false },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      },
      {
        module: 'support',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: true },
          { name: 'EDIT', enabled: false },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      },
      {
        module: 'overview',
        permissions: [
          { name: 'VIEW', enabled: true },
          { name: 'CREATE', enabled: false },
          { name: 'EDIT', enabled: false },
          { name: 'ACCEPT', enabled: false },
          { name: 'REJECT', enabled: false }
        ]
      }
    ],
    createdAt: '2024-02-10T11:45:00Z',
    updatedAt: '2024-02-10T11:45:00Z'
  }
];