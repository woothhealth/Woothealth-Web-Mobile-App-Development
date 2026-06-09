export type Client = {
  userId: string;
  firstName?: string;
  lastName?: string;
  companyName: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  planType: 'Business' | 'Retail';
  role?: string;
  enrolleeCount: number;
  activePlan: number;
  monthlyPremium: number;
  outstanding: number;
  walletBalance: number;
  contactPerson: string;
  email: string;
  phone: string;
  registrationDate: string;
  clientType?: string;
  $createdAt?: string;
};

export type Enrollee = {
  userId: string;
  dateAdded: string;
  $createdAt?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  plan: string;
  dependents: number;
};

export type InvoiceItem = {
  userId: string;
  itemName: string;
  price: number;
  quantity: number;
};

export type Invoice = {
  userId: string;
  invoiceNumber: string;
  companyName: string;
  firstName?: string;
  lastName?: string;
  amount: number;
  amountPaid: number;
  paymentStatus: 'Partial' | 'Full' | 'Overdue';
  issuedBy: string;
  issueDate: string;
  accountManager: string;
  invoiceStatus: string;
  paymentLink: string;
  items: InvoiceItem[];
};

export const mockClients: Client[] = [
  {
    userId: '1',
    companyName: 'Acme Corporation',
    status: 'Active',
    planType: 'Business',
    enrolleeCount: 250,
    activePlan: 240,
    monthlyPremium: 500000,
    outstanding: 100000,
    walletBalance: 250000,
    contactPerson: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+234 801 234 5678',
    registrationDate: '2024-01-15',
    clientType: 'Business Client',
    role: 'Business',
  },
  {
    userId: '2',
    companyName: 'TechStart Ltd',
    status: 'Active',
    planType: 'Retail',
    enrolleeCount: 120,
    activePlan: 115,
    monthlyPremium: 250000,
    outstanding: 50000,
    walletBalance: 150000,
    contactPerson: 'Jane Doe',
    email: 'jane.doe@techstart.com',
    phone: '+234 802 345 6789',
    registrationDate: '2024-02-20',
    clientType: 'Woothealth Retail',
    role: 'Retail',
  },
  {
    userId: '3',
    companyName: 'Global Solutions Inc',
    status: 'Suspended',
    planType: 'Business',
    enrolleeCount: 500,
    activePlan: 450,
    monthlyPremium: 1000000,
    outstanding: 300000,
    walletBalance: 0,
    contactPerson: 'Bob Johnson',
    email: 'bob.johnson@global.com',
    phone: '+234 803 456 7890',
    registrationDate: '2023-06-10',
    clientType: 'Business Client',
    role: 'Business',
  },
];

export const mockEnrollees: Enrollee[] = [
  {
    userId: '1',
    dateAdded: '2024-01-20',
    firstName: 'Amaka',
    lastName: 'Okafor',
    email: 'amaka.okafor@example.com',
    plan: 'Premium',
    dependents: 2,
  },
  {
    userId: '2',
    dateAdded: '2024-01-22',
    firstName: 'Chisom',
    lastName: 'Nwankwo',
    email: 'chisom.nwankwo@example.com',
    plan: 'Basic',
    dependents: 1,
  },
  {
    userId: '3',
    dateAdded: '2024-01-25',
    firstName: 'Oluwatoyin',
    lastName: 'Adeyemi',
    email: 'oluwatoyin.adeyemi@example.com',
    plan: 'Premium',
    dependents: 3,
  },
];

export const mockInvoices: Invoice[] = [
  {
    userId: '1',
    invoiceNumber: 'INV-2024-001',
    companyName: 'Acme Corporation',
    amount: 500000,
    amountPaid: 300000,
    paymentStatus: 'Partial',
    issuedBy: 'Admin User',
    issueDate: '2024-04-01',
    accountManager: 'Sarah Williams',
    invoiceStatus: 'Pending',
    paymentLink: 'https://payment.example.com/inv-001',
    items: [
      { userId: '1', itemName: 'Premium Plan', price: 250000, quantity: 2 },
      { userId: '2', itemName: 'Basic Plan', price: 100000, quantity: 1 },
    ],
  },
];
