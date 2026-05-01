export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Refund Request' | 'Cancelled';
export type AccountType = 'Retail Account' | 'Business Account';

export interface Invoice {
  id: string;
  invoiceId: string;
  client: string;
  amount: number;
  accountType: AccountType;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceId: 'INV-2024-001',
    client: 'Acme Corporation',
    amount: 150000,
    accountType: 'Business Account',
    status: 'Paid',
    date: '2024-01-15',
    dueDate: '2024-02-15',
  },
  {
    id: '2',
    invoiceId: 'INV-2024-002',
    client: 'TechStart Ltd',
    amount: 75000,
    accountType: 'Retail Account',
    status: 'Pending',
    date: '2024-01-20',
    dueDate: '2024-02-20',
  },
  {
    id: '3',
    invoiceId: 'INV-2024-003',
    client: 'Global Solutions Inc',
    amount: 200000,
    accountType: 'Business Account',
    status: 'Paid',
    date: '2024-01-25',
    dueDate: '2024-02-25',
  },
  {
    id: '4',
    invoiceId: 'INV-2024-004',
    client: 'Premier Retail Store',
    amount: 45000,
    accountType: 'Retail Account',
    status: 'Overdue',
    date: '2024-01-10',
    dueDate: '2024-02-10',
  },
  {
    id: '5',
    invoiceId: 'INV-2024-005',
    client: 'Enterprise Solutions Co',
    amount: 300000,
    accountType: 'Business Account',
    status: 'Paid',
    date: '2024-01-05',
    dueDate: '2024-02-05',
  },
  {
    id: '6',
    invoiceId: 'INV-2024-006',
    client: 'Small Shop Ltd',
    amount: 25000,
    accountType: 'Retail Account',
    status: 'Refund Request',
    date: '2024-01-30',
    dueDate: '2024-02-28',
  },
  {
    id: '7',
    invoiceId: 'INV-2024-007',
    client: 'Mega Store Group',
    amount: 125000,
    accountType: 'Retail Account',
    status: 'Paid',
    date: '2024-01-12',
    dueDate: '2024-02-12',
  },
  {
    id: '8',
    invoiceId: 'INV-2024-008',
    client: 'Digital Innovations Ltd',
    amount: 180000,
    accountType: 'Business Account',
    status: 'Pending',
    date: '2024-01-28',
    dueDate: '2024-02-28',
  },
  {
    id: '9',
    invoiceId: 'INV-2024-009',
    client: 'Retail Express Co',
    amount: 55000,
    accountType: 'Retail Account',
    status: 'Cancelled',
    date: '2024-01-08',
    dueDate: '2024-02-08',
  },
  {
    id: '10',
    invoiceId: 'INV-2024-010',
    client: 'Business Plus Inc',
    amount: 225000,
    accountType: 'Business Account',
    status: 'Paid',
    date: '2024-01-18',
    dueDate: '2024-02-18',
  },
];
