export type PrescriptionStatus = 'approved' | 'pending' | 'denied';

export interface PrescriptionDetail {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

export interface Prescription {
  id: string;
  date: string;
  patient: string;
  hmoId: string;
  doctor: string;
  specialization: string;
  status: PrescriptionStatus;
  diagnosis: string;
  details: PrescriptionDetail[];
}

export const mockPrescriptions: Prescription[] = [
  {
    id: 'RX-001-2026',
    date: '2026-04-15',
    patient: 'John Michael',
    hmoId: 'HMO-2024-001',
    doctor: 'Dr. Abiodun Okonkwo',
    specialization: 'Cardiology',
    status: 'approved',
    diagnosis: 'Hypertension Stage II with left ventricular hypertrophy. Patient presents with chest discomfort and palpitations.',
    details: [
      {
        medicationName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take in the morning with water on an empty stomach',
      },
      {
        medicationName: 'Amlodipine Besylate',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        instructions: 'Take in the evening with or without food',
      },
      {
        medicationName: 'Aspirin',
        dosage: '100mg',
        frequency: 'Once daily',
        duration: '60 days',
        quantity: 60,
        instructions: 'Take after breakfast with food',
      },
    ],
  },
  {
    id: 'RX-002-2026',
    date: '2026-04-14',
    patient: 'Chioma Adeyemi',
    hmoId: 'HMO-2024-005',
    doctor: 'Dr. Folake Bello',
    specialization: 'Pediatrics',
    status: 'approved',
    diagnosis: 'Acute respiratory infection with mild fever. Symptoms include cough, nasal congestion, and mild sore throat.',
    details: [
      {
        medicationName: 'Amoxicillin',
        dosage: '250mg/5ml',
        frequency: 'Three times daily',
        duration: '7 days',
        quantity: 7,
        instructions: 'Shake well before use. Take with food',
      },
      {
        medicationName: 'Paracetamol',
        dosage: '120mg/5ml',
        frequency: 'As needed (every 6 hours)',
        duration: '7 days',
        quantity: 1,
        instructions: 'Use for fever or pain, max 4 times daily',
      },
    ],
  },
  {
    id: 'RX-003-2026',
    date: '2026-04-13',
    patient: 'Ibrahim Hassan',
    hmoId: 'HMO-2024-012',
    doctor: 'Dr. Tunde Adebayo',
    specialization: 'Ophthalmology',
    status: 'pending',
    diagnosis: 'Refractive error with myopia. Patient experiencing blurred vision at distance.',
    details: [
      {
        medicationName: 'Tropicamide',
        dosage: '1%',
        frequency: 'Once daily',
        duration: '14 days',
        quantity: 1,
        instructions: 'Apply 1 drop in each eye in the evening',
      },
    ],
  },
  {
    id: 'RX-004-2026',
    date: '2026-04-12',
    patient: 'Zainab Malik',
    hmoId: 'HMO-2024-008',
    doctor: 'Dr. Ngozi Okoro',
    specialization: 'Dermatology',
    status: 'denied',
    diagnosis: 'Bacterial skin infection. Suspected impetigo on forearm.',
    details: [
      {
        medicationName: 'Mupirocin',
        dosage: '2%',
        frequency: 'Three times daily',
        duration: '10 days',
        quantity: 1,
        instructions: 'Apply topically to affected area after cleaning',
      },
    ],
  },
  {
    id: 'RX-005-2026',
    date: '2026-04-11',
    patient: 'David Okafor',
    hmoId: 'HMO-2024-015',
    doctor: 'Dr. Chidi Nwankwo',
    specialization: 'Internal Medicine',
    status: 'approved',
    diagnosis: 'Type 2 Diabetes Mellitus with suboptimal glycemic control. Fasting blood sugar 145 mg/dL.',
    details: [
      {
        medicationName: 'Metformin HCl',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '90 days',
        quantity: 180,
        instructions: 'Take with meals to reduce GI distress',
      },
      {
        medicationName: 'Glibenclamide',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '90 days',
        quantity: 90,
        instructions: 'Take in the morning with breakfast',
      },
    ],
  },
  {
    id: 'RX-006-2026',
    date: '2026-04-10',
    patient: 'Omotayo Akindele',
    hmoId: 'HMO-2024-003',
    doctor: 'Dr. Buki Adeneye',
    specialization: 'Orthopedics',
    status: 'approved',
    diagnosis: 'Acute lower back pain with muscle spasm. Suspected lumbar strain from occupational activity.',
    details: [
      {
        medicationName: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Three times daily',
        duration: '14 days',
        quantity: 42,
        instructions: 'Take with food or milk to prevent stomach upset',
      },
      {
        medicationName: 'Diclofenac Sodium',
        dosage: '50mg',
        frequency: 'Twice daily',
        duration: '7 days',
        quantity: 14,
        instructions: 'Take after meals',
      },
    ],
  },
  {
    id: 'RX-007-2026',
    date: '2026-04-09',
    patient: 'Adekunle Timmy',
    hmoId: 'HMO-2024-009',
    doctor: 'Dr. Stella Ifeoma',
    specialization: 'Gynecology',
    status: 'pending',
    diagnosis: 'Menorrhagia with iron-deficiency anemia. Hemoglobin 8.5 g/dL.',
    details: [
      {
        medicationName: 'Ferrous Sulfate',
        dosage: '200mg',
        frequency: 'Once daily',
        duration: '90 days',
        quantity: 90,
        instructions: 'Take with orange juice to enhance absorption',
      },
      {
        medicationName: 'Mefenamic Acid',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '5 days (during menstruation)',
        quantity: 15,
        instructions: 'Start when menstruation begins',
      },
    ],
  },
];
