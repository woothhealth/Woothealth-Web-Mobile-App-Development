export interface NotificationItem {
  id: string;
  title: string;
  agent: string;
  timeframe: string;
  patientInfo: {
    name: string;
    age: string;
    gender: string;
    patientId: string;
    note: string;
  };
  serviceDetails: string;
  medicalDetails: string;
  treatmentDescription: string;
  requestedBy: string;
  feedHistory: Array<{ id: string; author: string; createdAt: string; message: string }>;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Lab results review required',
    agent: 'Dr. Sarah Bennett',
    timeframe: 'Due in 3 hours',
    patientInfo: {
      name: 'Samuel Johnson',
      age: '42',
      gender: 'Male',
      patientId: 'P-00123',
      note: 'Follow up on abnormal blood work.',
    },
    serviceDetails: 'Radiology lab review and follow-up consultation.',
    medicalDetails: 'Elevated glucose, abnormal liver enzymes, mild anemia.',
    treatmentDescription: 'Recommend medication adjustment and repeat labs in 7 days.',
    requestedBy: 'Nurse Claire Adams',
    feedHistory: [
      {
        id: 'feed-1',
        author: 'Nurse Claire Adams',
        createdAt: '2 hours ago',
        message: 'Patient has been notified of the follow-up appointment.'
      },
      {
        id: 'feed-2',
        author: 'Dr. Sarah Bennett',
        createdAt: '1 hour ago',
        message: 'Reviewing the lab notes ahead of the consultation.'
      }
    ]
  },
  {
    id: 'notif-2',
    title: 'Prescription renewal request',
    agent: 'Pharmacy Team',
    timeframe: 'Today',
    patientInfo: {
      name: 'Amelia Hart',
      age: '29',
      gender: 'Female',
      patientId: 'P-00456',
      note: 'Needs renewal for hypertension medication.',
    },
    serviceDetails: 'Prescription verification and approval.',
    medicalDetails: 'Hypertension, stable blood pressure on current therapy.',
    treatmentDescription: 'Approve renewal for 90-day supply with current dosage.',
    requestedBy: 'Admin Robert Miles',
    feedHistory: [
      {
        id: 'feed-3',
        author: 'Admin Robert Miles',
        createdAt: '4 hours ago',
        message: 'Prescription renewal entered and waiting verification.'
      }
    ]
  },
  {
    id: 'notif-3',
    title: 'Urgent telemedicine consult',
    agent: 'Telemedicine Team',
    timeframe: 'In 30 minutes',
    patientInfo: {
      name: 'Liam Carter',
      age: '65',
      gender: 'Male',
      patientId: 'P-00789',
      note: 'Needs urgent consult for chest pain symptoms.',
    },
    serviceDetails: 'Telemedicine triage and consultation scheduling.',
    medicalDetails: 'Recent onset chest discomfort, hypertension history.',
    treatmentDescription: 'Schedule immediate telemedicine consult and notify cardiology.',
    requestedBy: 'Nurse Practitioner Lila Rose',
    feedHistory: [
      {
        id: 'feed-4',
        author: 'Nurse Practitioner Lila Rose',
        createdAt: '15 minutes ago',
        message: 'Telemedicine consult request submitted to the on-call doctor.'
      }
    ]
  }
];
