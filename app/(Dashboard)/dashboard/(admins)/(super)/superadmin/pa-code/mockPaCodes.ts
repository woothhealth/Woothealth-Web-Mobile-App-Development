export type PaCode = {
  id: string;
  authorizationCode: string;
  createdDate: string;
  providerName: string;
  patientId: string;
  status: 'approved' | 'under review' | 'declined' | 'pending';
};

export const mockPaCodes: PaCode[] = [
  {
    id: '69e1e3ea53d96324f4d5',
    authorizationCode: 'WHT-PA-367899',
    createdDate: '2026-04-17',
    providerName: 'Dolu Hospital',
    patientId: 'WHT-0001-A',
    status: 'approved',
  },
  {
    id: '69e1e3ea53d96324f4d6',
    authorizationCode: 'WHT-PA-367900',
    createdDate: '2026-04-18',
    providerName: 'Sunshine Medical Center',
    patientId: 'WHT-0002-B',
    status: 'under review',
  },
  {
    id: '69e1e3ea53d96324f4d7',
    authorizationCode: 'WHT-PA-367901',
    createdDate: '2026-04-19',
    providerName: 'Vision Care Optical',
    patientId: 'WHT-0003-C',
    status: 'declined',
  },
  {
    id: '69e1e3ea53d96324f4d8',
    authorizationCode: 'WHT-PA-367902',
    createdDate: '2026-04-20',
    providerName: 'City General Hospital',
    patientId: 'WHT-0004-D',
    status: 'under review',
  },
  {
    id: '69e1e3ea53d96324f4d9',
    authorizationCode: 'WHT-PA-367903',
    createdDate: '2026-04-21',
    providerName: 'Metro Health Clinic',
    patientId: 'WHT-0005-E',
    status: 'approved',
  },
];