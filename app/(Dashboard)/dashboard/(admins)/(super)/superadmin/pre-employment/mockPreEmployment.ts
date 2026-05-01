export type PreEmploymentStatus = 'completed' | 'scheduled' | 'pending' | 'overdue' | 'approved';

export interface PreEmploymentTest {
  id: string;
  dateOfService: string;
  employeeName: string;
  employeeEmail: string;
  employeePhone: string;
  employeeDOB: string;
  company: string;
  insurancePlan: string;
  provider: string;
  testTypes: string[];
  status: PreEmploymentStatus;
  scheduledDate: string;
  createdAt: string;
}

export const mockPreEmployment: PreEmploymentTest[] = [
  {
    id: 'PRE-001-2026',
    dateOfService: '2026-04-20',
    scheduledDate: '2026-04-20',
    employeeName: 'Adanna Eze',
    employeeEmail: 'adanna.eze@example.com',
    employeePhone: '+234 803 555 0123',
    employeeDOB: '1991-06-14',
    company: 'PrimeTech Solutions',
    insurancePlan: 'Corporate Plus Plan',
    provider: 'HealthFirst Diagnostics',
    testTypes: ['Drug Screening', 'Vision Test'],
    status: 'scheduled',
    createdAt: '2026-04-12T09:30:00Z',
  },
  {
    id: 'PRE-002-2026',
    dateOfService: '2026-04-12',
    scheduledDate: '2026-04-12',
    employeeName: 'Chike Nwosu',
    employeeEmail: 'chike.nwosu@example.com',
    employeePhone: '+234 802 222 8754',
    employeeDOB: '1987-03-22',
    company: 'Greenfield Manufacturing',
    insurancePlan: 'Standard Employee Plan',
    provider: 'CarePlus Labs',
    testTypes: ['Medical History Review', 'Hearing Test'],
    status: 'completed',
    createdAt: '2026-04-05T14:10:00Z',
  },
  {
    id: 'PRE-003-2026',
    dateOfService: '2026-04-18',
    scheduledDate: '2026-04-18',
    employeeName: 'Ngozi Okafor',
    employeeEmail: 'ngozi.okafor@example.com',
    employeePhone: '+234 806 998 7765',
    employeeDOB: '1994-10-09',
    company: 'NextWave Logistics',
    insurancePlan: 'Executive Health Plan',
    provider: 'WellCare Screening',
    testTypes: ['Drug Screening', 'Screening ECG'],
    status: 'pending',
    createdAt: '2026-04-10T11:45:00Z',
  },
  {
    id: 'PRE-004-2026',
    dateOfService: '2026-04-10',
    scheduledDate: '2026-04-10',
    employeeName: 'Tosin Adebayo',
    employeeEmail: 'tosin.adebayo@example.com',
    employeePhone: '+234 809 112 3344',
    employeeDOB: '1990-01-27',
    company: 'Apex Energy',
    insurancePlan: 'Employer Bronze Plan',
    provider: 'GentleHealth Clinic',
    testTypes: ['Drug Screening', 'Urinalysis'],
    status: 'overdue',
    createdAt: '2026-04-02T08:20:00Z',
  },
  {
    id: 'PRE-005-2026',
    dateOfService: '2026-04-16',
    scheduledDate: '2026-04-16',
    employeeName: 'Bola Adekunle',
    employeeEmail: 'bola.adekunle@example.com',
    employeePhone: '+234 701 234 5567',
    employeeDOB: '1984-12-03',
    company: 'NovaTech Industries',
    insurancePlan: 'HealthGuard Elite',
    provider: 'Pioneer Health Services',
    testTypes: ['Vision Test', 'Hearing Test'],
    status: 'approved',
    createdAt: '2026-04-07T16:55:00Z',
  },
];
