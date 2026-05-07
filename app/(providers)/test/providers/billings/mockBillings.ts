import type { Billing } from './InvoiceModal';

export const MOCK_BILLINGS: Billing[] = [
  {
    id: 'bill-001',
    date: '2024-04-15',
    invoiceNo: 'INV-2024-001',
    status: 'paid',
    hmoId: 'HMO-2103',
    dueDate: '2024-05-15',
    amount: 150000,
    billTo: {
      name: 'Ada Lovelace',
      address: '123 Health St, Lagos',
      email: 'ada@example.com',
      tel: '+234 123 456 7890'
    },
    billFrom: {
      name: 'Woot Health Clinic',
      address: '456 Medical Ave, Abuja',
      email: 'billing@woothealth.com',
      tel: '+234 987 654 3210'
    },
    treatments: [
      {
        itemCode: 'TREAT-001',
        desc: 'Consultation',
        quantity: 1,
        unitPrice: 50000,
        amount: 50000
      },
      {
        itemCode: 'TREAT-002',
        desc: 'Lab Test',
        quantity: 2,
        unitPrice: 25000,
        amount: 50000
      },
      {
        itemCode: 'TREAT-003',
        desc: 'Medication',
        quantity: 1,
        unitPrice: 50000,
        amount: 50000
      }
    ],
    subtotal: 150000,
    taxPercent: 7.5,
    taxAmount: 11250,
    totalAmount: 161250,
    paymentInfo: {
      method: 'Bank Transfer',
      transactionId: 'TXN-123456789',
      paymentDate: '2024-04-20'
    }
  },
  {
    id: 'bill-002',
    date: '2024-03-20',
    invoiceNo: 'INV-2024-002',
    status: 'denied',
    hmoId: 'HMO-4187',
    dueDate: '2024-04-20',
    amount: 75000,
    billTo: {
      name: 'Kwame Nkrumah',
      address: '789 Wellness Rd, Port Harcourt',
      email: 'kwame@example.com',
      tel: '+234 234 567 8901'
    },
    billFrom: {
      name: 'Woot Health Clinic',
      address: '456 Medical Ave, Abuja',
      email: 'billing@woothealth.com',
      tel: '+234 987 654 3210'
    },
    treatments: [
      {
        itemCode: 'TREAT-004',
        desc: 'Surgery',
        quantity: 1,
        unitPrice: 75000,
        amount: 75000
      }
    ],
    subtotal: 75000,
    taxPercent: 7.5,
    taxAmount: 5625,
    totalAmount: 80625,
    paymentInfo: {
      method: 'Credit Card',
      transactionId: 'TXN-987654321',
      paymentDate: '2024-03-25'
    }
  }
];