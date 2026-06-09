export interface EnrolleeFeed {
  id: string;
  type: 'pa-code' | 'plan-purchase' | 'benefits' | 'declined-care' | 'general';
  agentName?: string;
  description: string;
  createdAt: string;
  feedTimestamp?: string;
}

export const mockEnrolleeFeedData: Record<string, EnrolleeFeed[]> = {
  'enrollee-1': [
    {
      id: 'feed-1',
      type: 'pa-code',
      agentName: 'John Doe',
      description: 'PA code requested for orthopedic surgery',
      createdAt: '2024-05-15'
    },
    {
      id: 'feed-2',
      type: 'general',
      agentName: 'Jane Smith',
      description: 'Claim CLM-2024-00512 submitted for review',
      createdAt: '2024-05-10'
    },
    {
      id: 'feed-3',
      type: 'general',
      agentName: 'Admin User',
      description: 'Plan upgraded from Basic to Premium',
      createdAt: '2024-05-01'
    }
  ],
  'enrollee-2': [
    {
      id: 'feed-4',
      type: 'general',
      agentName: 'Admin User',
      description: 'Annual enrollment completed',
      createdAt: '2024-04-20'
    },
    {
      id: 'feed-5',
      type: 'general',
      agentName: 'Admin User',
      description: 'Claim CLM-2024-00401 approved',
      createdAt: '2024-04-15'
    }
  ],
  'enrollee-3': [
    {
      id: 'feed-6',
      type: 'general',
      agentName: 'Admin User',
      description: 'Dental reimbursement processed. Amount: $800',
      createdAt: '2024-05-12'
    },
    {
      id: 'feed-7',
      type: 'general',
      agentName: 'Admin User',
      description: 'Added 1 dependent to plan',
      createdAt: '2024-05-05'
    },
    {
      id: 'feed-8',
      type: 'general',
      agentName: 'Admin User',
      description: 'Profile updated successfully',
      createdAt: '2024-05-01'
    },
    {
      id: 'feed-9',
      type: 'general',
      agentName: 'Admin User',
      description: 'Claim CLM-2024-00298 submitted',
      createdAt: '2024-04-28'
    }
  ]
};
