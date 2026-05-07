export type NotificationStatus = 'approved' | 'denied' | 'pending';

export interface Notification {
  id: string;
  firstname: string;
  lastname: string;
  hmoId: string;
  plan: string;
  status: NotificationStatus;
  title: string;
  paCode: string;
  time: string;
  receivedAt: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'note-001',
    firstname: 'Ada',
    lastname: 'Lovelace',
    hmoId: 'HMO-2103',
    plan: 'Premium Care',
    status: 'approved',
    title: 'PA Request Approved',
    paCode: 'PA-001-2024',
    time: '2 mins ago',
    receivedAt: '2024-04-20T14:20:00.000Z'
  },
  {
    id: 'note-002',
    firstname: 'Kwame',
    lastname: 'Nkrumah',
    hmoId: 'HMO-4187',
    plan: 'Standard Wellness',
    status: 'denied',
    title: 'PA Request Denied',
    paCode: 'PA-002-2024',
    time: '1 hour ago',
    receivedAt: '2024-04-20T13:15:00.000Z'
  },
  {
    id: 'note-003',
    firstname: 'Grace',
    lastname: 'Hopper',
    hmoId: 'HMO-7231',
    plan: 'Family Health',
    status: 'pending',
    title: 'PA Request Pending',
    paCode: 'PA-003-2024',
    time: 'Yesterday',
    receivedAt: '2024-04-19T08:10:00.000Z'
  },
  {
    id: 'note-004',
    firstname: 'Mary',
    lastname: 'Jackson',
    hmoId: 'HMO-9922',
    plan: 'Executive Care',
    status: 'approved',
    title: 'PA Request Approved',
    paCode: 'PA-004-2024',
    time: '2 days ago',
    receivedAt: '2024-04-18T10:30:00.000Z'
  },
  {
    id: 'note-005',
    firstname: 'Alan',
    lastname: 'Turing',
    hmoId: 'HMO-5401',
    plan: 'Premium Care',
    status: 'pending',
    title: 'PA Request Pending',
    paCode: 'PA-005-2024',
    time: '3 days ago',
    receivedAt: '2024-04-17T12:00:00.000Z'
  },
  {
    id: 'note-006',
    firstname: 'Dorothy',
    lastname: 'Vaughan',
    hmoId: 'HMO-3114',
    plan: 'Standard Wellness',
    status: 'denied',
    title: 'PA Request Denied',
    paCode: 'PA-006-2024',
    time: '4 days ago',
    receivedAt: '2024-04-16T15:45:00.000Z'
  }
];
