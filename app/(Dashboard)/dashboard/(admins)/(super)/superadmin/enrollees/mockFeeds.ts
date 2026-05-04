export interface EnrolleeFeed {
  id: string;
  type: 'reimbursement' | 'claim' | 'enrollment' | 'general';
  description: string;
  createdAt: string;
}

export const mockEnrolleeFeedData: Record<string, EnrolleeFeed[]> = {
  'enrollee-1': [
    {
      id: 'feed-1',
      type: 'reimbursement',
      description: 'Reimbursement request for orthopedic surgery approved. Amount: $5,000',
      createdAt: '2024-05-15'
    },
    {
      id: 'feed-2',
      type: 'claim',
      description: 'Claim CLM-2024-00512 submitted for review',
      createdAt: '2024-05-10'
    },
    {
      id: 'feed-3',
      type: 'enrollment',
      description: 'Plan upgraded from Basic to Premium',
      createdAt: '2024-05-01'
    }
  ],
  'enrollee-2': [
    {
      id: 'feed-4',
      type: 'general',
      description: 'Annual enrollment completed',
      createdAt: '2024-04-20'
    },
    {
      id: 'feed-5',
      type: 'claim',
      description: 'Claim CLM-2024-00401 approved',
      createdAt: '2024-04-15'
    }
  ],
  'enrollee-3': [
    {
      id: 'feed-6',
      type: 'reimbursement',
      description: 'Dental reimbursement processed. Amount: $800',
      createdAt: '2024-05-12'
    },
    {
      id: 'feed-7',
      type: 'enrollment',
      description: 'Added 1 dependent to plan',
      createdAt: '2024-05-05'
    },
    {
      id: 'feed-8',
      type: 'general',
      description: 'Profile updated successfully',
      createdAt: '2024-05-01'
    },
    {
      id: 'feed-9',
      type: 'claim',
      description: 'Claim CLM-2024-00298 submitted',
      createdAt: '2024-04-28'
    }
  ]
};
