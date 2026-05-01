export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Suspended';
  dependants: number;
  hmoId: string;
  plan: string;
  homeAddress: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  coverStartDate: string;
  coverEndDate: string;
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  autoBillingEnabled: boolean;
};

export const usersMock: UserProfile[] = [
  {
    id: 'user-1',
    fullName: 'Amina Joseph',
    email: 'amina.joseph@example.com',
    phone: '+234 801 234 5678',
    status: 'Active',
    dependants: 2,
    hmoId: 'HMO-8901',
    plan: 'Premium Health Plan',
    homeAddress: '14B Ijaye Street, Lagos, Nigeria',
    dob: '1988-05-21',
    gender: 'Female',
    coverStartDate: '2025-01-01',
    coverEndDate: '2026-01-01',
    paymentFrequency: 'Monthly',
    autoBillingEnabled: true,
  },
  {
    id: 'user-2',
    fullName: 'Chukwu Emeka',
    email: 'chukwu.emeka@example.com',
    phone: '+234 802 345 6789',
    status: 'Active',
    dependants: 1,
    hmoId: 'HMO-4320',
    plan: 'Family Care Plan',
    homeAddress: '88 Ahmadu Bello way, Abuja, Nigeria',
    dob: '1990-09-12',
    gender: 'Male',
    coverStartDate: '2025-04-10',
    coverEndDate: '2026-04-09',
    paymentFrequency: 'Quarterly',
    autoBillingEnabled: false,
  },
  {
    id: 'user-3',
    fullName: 'Zainab Ibrahim',
    email: 'zainab.ibrahim@example.com',
    phone: '+234 803 456 7890',
    status: 'Suspended',
    dependants: 0,
    hmoId: 'HMO-1237',
    plan: 'Silver Care Plan',
    homeAddress: '2A Alhaji Musa Road, Kano, Nigeria',
    dob: '1995-11-03',
    gender: 'Female',
    coverStartDate: '2024-08-01',
    coverEndDate: '2025-07-31',
    paymentFrequency: 'Annually',
    autoBillingEnabled: false,
  },
  {
    id: 'user-4',
    fullName: 'Daniel Okoro',
    email: 'daniel.okoro@example.com',
    phone: '+234 805 567 8901',
    status: 'Suspended',
    dependants: 3,
    hmoId: 'HMO-7765',
    plan: 'Executive Health Plan',
    homeAddress: '1 Victoria Island, Lagos, Nigeria',
    dob: '1982-03-16',
    gender: 'Male',
    coverStartDate: '2025-02-14',
    coverEndDate: '2026-02-13',
    paymentFrequency: 'Monthly',
    autoBillingEnabled: true,
  },
];
