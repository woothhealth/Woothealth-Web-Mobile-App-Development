export type Client = {
  id: string;
  companyName: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  planType: 'Business' | 'Retail';
  totalEnrollees: number;
  activePlan: number;
  monthlyPremium: number;
  outstanding: number;
  walletBalance: number;
  contactPerson: string;
  email: string;
  phone: string;
  registrationDate: string;
  clientType?: string;
};

export type Enrollee = {
  id: string;
  dateAdded: string;
  name: string;
  email: string;
  planType: string;
  dependents: number;
};

export type InvoiceItem = {
  id: string;
  itemName: string;
  price: number;
  quantity: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  companyName: string;
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
    id: '1',
    companyName: 'Acme Corporation',
    status: 'Active',
    planType: 'Business',
    totalEnrollees: 250,
    activePlan: 240,
    monthlyPremium: 500000,
    outstanding: 100000,
    walletBalance: 250000,
    contactPerson: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+234 801 234 5678',
    registrationDate: '2024-01-15',
    clientType: 'Business Client',
  },
  {
    id: '2',
    companyName: 'TechStart Ltd',
    status: 'Active',
    planType: 'Retail',
    totalEnrollees: 120,
    activePlan: 115,
    monthlyPremium: 250000,
    outstanding: 50000,
    walletBalance: 150000,
    contactPerson: 'Jane Doe',
    email: 'jane.doe@techstart.com',
    phone: '+234 802 345 6789',
    registrationDate: '2024-02-20',
    clientType: 'Woothealth Retail',
  },
  {
    id: '3',
    companyName: 'Global Solutions Inc',
    status: 'Suspended',
    planType: 'Business',
    totalEnrollees: 500,
    activePlan: 450,
    monthlyPremium: 1000000,
    outstanding: 300000,
    walletBalance: 0,
    contactPerson: 'Bob Johnson',
    email: 'bob.johnson@global.com',
    phone: '+234 803 456 7890',
    registrationDate: '2023-06-10',
    clientType: 'Business Client',
  },
];

export const mockEnrollees: Enrollee[] = [
  {
    id: '1',
    dateAdded: '2024-01-20',
    name: 'Amaka Okafor',
    email: 'amaka.okafor@example.com',
    planType: 'Premium',
    dependents: 2,
  },
  {
    id: '2',
    dateAdded: '2024-01-22',
    name: 'Chisom Nwankwo',
    email: 'chisom.nwankwo@example.com',
    planType: 'Basic',
    dependents: 1,
  },
  {
    id: '3',
    dateAdded: '2024-01-25',
    name: 'Oluwatoyin Adeyemi',
    email: 'oluwatoyin.adeyemi@example.com',
    planType: 'Premium',
    dependents: 3,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
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
      { id: '1', itemName: 'Premium Plan', price: 250000, quantity: 2 },
      { id: '2', itemName: 'Basic Plan', price: 100000, quantity: 1 },
    ],
  },
];
