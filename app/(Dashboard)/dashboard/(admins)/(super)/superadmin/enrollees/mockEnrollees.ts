export type Enrollee = {
  id: string;
  name: string;
  email: string;
  status: string;
  hmoId?: string;
  plan?: string;
  address?: string;
  enrollmentDate?: string;
  expiryDate?: string;
  dependants?: number;
  benefitBalance?: string;
  [key: string]: any;
};

export const mockEnrollees: Enrollee[] = [
  {
    id: 'enrollee-1',
    name: 'Emma Watson',
    email: 'emma.watson@example.com',
    status: 'active',
    hmoId: 'HMO-00123',
    enrollmentDate: '2024-04-12',
    expiryDate: '2025-04-11',
    dependants: 2,
    plan: 'Premium Health Plan',
    benefitBalance: '$3,500',
  },
  {
    id: 'enrollee-2',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    status: 'inactive',
    hmoId: 'HMO-00456',
    enrollmentDate: '2023-11-08',
    expiryDate: '2024-11-07',
    dependants: 0,
    plan: 'Basic Health Plan',
    benefitBalance: '$1,200',
  },
  {
    id: 'enrollee-3',
    name: 'Sara Alvarez',
    email: 'sara.alvarez@example.com',
    status: 'active',
    hmoId: 'HMO-00789',
    enrollmentDate: '2024-01-22',
    expiryDate: '2025-01-21',
    dependants: 1,
    plan: 'Family Health Plan',
    benefitBalance: '$2,800',
  }
];
