export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Claim {
  id: string;
  dateOfService: string;
  patientName: string;
  hmoId: string;
  amount: number;
  status: ClaimStatus;
  providerName: string;
  paCode: string;
  notes: string;
  dateSubmitted: string;
  treatment: {
    itemCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
}

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'claim-001',
    dateOfService: '2024-04-18T00:00:00.000Z',
    dateSubmitted: '2024-04-20T00:00:00.000Z',
    patientName: 'Ada Lovelace',
    hmoId: 'HMO-2103',
    amount: 132500,
    status: 'pending',
    providerName: 'Woot Health Clinic',
    paCode: 'WHT-CLAIM-001',
    notes: 'Claim awaiting review.',
    treatment: [
      {
        itemCode: 'TREAT-001',
        description: 'Consultation',
        quantity: 1,
        unitPrice: 132500,
        amount: 132500,
      }
    ]
  },
  {
    id: 'claim-002',
    dateOfService: '2024-03-25T00:00:00.000Z',
    dateSubmitted: '2024-03-27T00:00:00.000Z',
    patientName: 'Kwame Nkrumah',
    hmoId: 'HMO-4187',
    amount: 84500,
    status: 'approved',
    providerName: 'Sunrise Medical Center',
    paCode: 'WHT-CLAIM-002',
    notes: 'Approved after review.',
    treatment: [
      {
        itemCode: 'TREAT-003',
        description: 'Diagnostic Test',
        quantity: 1,
        unitPrice: 84500,
        amount: 84500,
      },
      {
        itemCode: 'TREAT-004',
        description: 'Follow-up Consultation',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      }
    ]
  },
  {
    id: 'claim-003',
    dateOfService: '2024-04-05T00:00:00.000Z',
    dateSubmitted: '2024-04-07T00:00:00.000Z',
    patientName: 'Chinelo Okafor',
    hmoId: 'HMO-9920',
    amount: 56000,
    status: 'rejected',
    providerName: 'Evercare Hospital',
    paCode: 'WHT-CLAIM-003',
    notes: 'Rejected due to missing documentation.',
    treatment: [
      {
        itemCode: 'TREAT-002',
        description: 'Medication',
        quantity: 1,
        unitPrice: 56000,
        amount: 56000,
      }
    ]
  },
];
