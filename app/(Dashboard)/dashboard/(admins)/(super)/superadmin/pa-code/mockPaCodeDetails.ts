export type PaCodeDetail = {
  authorizationCode: string;
  policyNumber: string;
  diagnosis: string;
  providerName: string;
  createdDate: string;
  source: string;
  patientId: string;
  patientName: string;
  patientDob: string;
  providerId: string;
  patientEmail: string;
  providerTier: string;
  patientPlan: string;
  careType?: string;
  assignedAgent?: string;
  treatment?: Array<{
    itemCode?: string;
    description?: string;
    quantity?: number;
    unitPrice?: number;
    Amount?: number;
    TotalAmount?: number;
  }>;
  patientsBenefits: Array<{
    name: string;
    covered: boolean;
  }>;
  status: 'approved' | 'under review' | 'declined';
  bookingId: string;
  $id: string;
};

export const mockPaCodeDetails: Record<string, PaCodeDetail> = {
  '69e1e3ea53d96324f4d5': {
    authorizationCode: 'WHT-PA-367899',
    policyNumber: 'POL-789012',
    diagnosis: 'Acute respiratory infection\nTariff: 1000.00\nDetails: Patient requires immediate treatment with antibiotics and respiratory support',
    providerName: 'Dolu Hospital',
    createdDate: '2026-04-17T10:30:00Z',
    source: 'Online Portal',
    patientId: 'WHT-0001-A',
    patientName: 'John Doe',
    patientDob: '1985-06-15',
    patientEmail: 'john.doe@example.com',
    providerId: 'PROV-456',
    providerTier: 'Tier 1',
    patientPlan: 'Gold Plan',
    patientsBenefits: [
      { name: 'Consultation', covered: true },
      { name: 'Medication', covered: true },
      { name: 'Lab Tests', covered: true },
      { name: 'X-Ray', covered: true }
    ],
    status: 'approved',
    bookingId: 'BK-789',
    $id: '69e1e3ea53d96324f4d5'
  },
  '69e1e3ea53d96324f4d6': {
    authorizationCode: 'WHT-PA-367900',
    policyNumber: 'POL-789013',
    diagnosis: 'Cardiac evaluation\nTariff: 2500.00\nDetails: Patient needs comprehensive cardiac assessment including ECG and echocardiography',
    providerName: 'Sunshine Medical Center',
    createdDate: '2026-04-18T14:15:00Z',
    source: 'Mobile App',
    patientId: 'WHT-0002-B',
    patientName: 'Jane Smith',
    patientDob: '1990-03-20',
    patientEmail: 'jane.smith@example.com',
    providerId: 'PROV-789',
    providerTier: 'Tier 2',
    patientPlan: 'Premium Plan',
    patientsBenefits: [
      { name: 'Consultation', covered: true },
      { name: 'ECG', covered: true },
      { name: 'Echocardiography', covered: false },
      { name: 'Cardiac Stress Test', covered: true }
    ],
    status: 'under review',
    bookingId: 'BK-790',
    $id: '69e1e3ea53d96324f4d6'
  },
  '69e1e3ea53d96324f4d7': {
    authorizationCode: 'WHT-PA-367901',
    policyNumber: 'POL-789014',
    diagnosis: 'Vision correction surgery\nTariff: 1800.00\nDetails: LASIK procedure for refractive error correction',
    providerName: 'Vision Care Optical',
    createdDate: '2026-04-19T09:45:00Z',
    source: 'Provider Portal',
    patientId: 'WHT-0003-C',
    patientName: 'Emily Johnson',
    patientDob: '1995-11-05',
    patientEmail: 'emily.johnson@example.com',
    providerId: 'PROV-123',
    providerTier: 'Tier 1',
    patientPlan: 'Basic Plan',
    patientsBenefits: [
      { name: 'Consultation', covered: true },
      { name: 'LASIK Surgery', covered: false },
      { name: 'Pre-op Assessment', covered: true },
      { name: 'Post-op Care', covered: true }
    ],
    status: 'declined',
    bookingId: 'BK-791',
    $id: '69e1e3ea53d96324f4d7'
  },
  '69e1e3ea53d96324f4d8': {
    authorizationCode: 'WHT-PA-367902',
    policyNumber: 'POL-789015',
    diagnosis: 'Orthopedic consultation\nTariff: 800.00\nDetails: Initial assessment for knee pain and mobility issues',
    providerName: 'City General Hospital',
    createdDate: '2026-04-20T11:20:00Z',
    source: 'Online Portal',
    patientId: 'WHT-0004-D',
    patientName: 'Michael Brown',
    patientDob: '1988-09-12',
    patientEmail: 'michael.brown@example.com',
    providerId: 'PROV-456',
    providerTier: 'Tier 1',
    patientPlan: 'Family Plan',
    patientsBenefits: [
      { name: 'Consultation', covered: true },
      { name: 'X-Ray', covered: true },
      { name: 'MRI', covered: false },
      { name: 'Physical Therapy', covered: true }
    ],
    status: 'under review',
    bookingId: 'BK-792',
    $id: '69e1e3ea53d96324f4d8'
  },
  '69e1e3ea53d96324f4d9': {
    authorizationCode: 'WHT-PA-367903',
    policyNumber: 'POL-789016',
    diagnosis: 'Dental procedure\nTariff: 1200.00\nDetails: Root canal treatment for infected tooth',
    providerName: 'Metro Health Clinic',
    createdDate: '2026-04-21T16:30:00Z',
    source: 'Mobile App',
    patientId: 'WHT-0005-E',
    patientName: 'Sarah Davis',
    patientDob: '1992-07-08',
    patientEmail: 'sarah.davis@example.com',
    providerId: 'PROV-234',
    providerTier: 'Tier 1',
    patientPlan: 'Dental Plus Plan',
    patientsBenefits: [
      { name: 'Consultation', covered: true },
      { name: 'Root Canal', covered: true },
      { name: 'X-Ray', covered: true },
      { name: 'Follow-up', covered: true }
    ],
    status: 'approved',
    bookingId: 'BK-793',
    $id: '69e1e3ea53d96324f4d9'
  }
};