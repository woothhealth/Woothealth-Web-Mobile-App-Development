export type LeadStatus = 'New Lead' | 'Contacted' | 'Converted' | 'Lost';

export type Lead = {
  id: string;
  clientName: string;
  clientType: string;
  email: string;
  phone: string;
  contactPerson: string;
  potentialEmployees: number;
  assignedTo: string;
  logNote: string;
  status: LeadStatus;
  dateAdded: string;
};

export const clientTypes = ['Corporate', 'SMB', 'Enterprise', 'Individual'];
export const salesReps = ['Amina Musa', 'Tunde Ade', 'Chioma Eze', 'Kemi Oladipo'];
export const leadStatuses: LeadStatus[] = ['New Lead', 'Contacted', 'Converted', 'Lost'];

export const mockLeads: Lead[] = [
  {
    id: '1',
    clientName: 'Woolworth Holdings',
    clientType: 'Corporate',
    email: 'hello@woolworth.com',
    phone: '+234 801 234 5678',
    contactPerson: 'Ugochi Nwaneri',
    potentialEmployees: 120,
    assignedTo: 'Amina Musa',
    logNote: 'Reached out by email. Waiting on brochure approval.',
    status: 'New Lead',
    dateAdded: '2026-04-15',
  },
  {
    id: '2',
    clientName: 'Greenfield Farms',
    clientType: 'SMB',
    email: 'contact@greenfield.com',
    phone: '+234 802 345 6789',
    contactPerson: 'Daniel Okeke',
    potentialEmployees: 42,
    assignedTo: 'Tunde Ade',
    logNote: 'Spoke on phone; sending proposal.',
    status: 'Contacted',
    dateAdded: '2026-04-12',
  },
  {
    id: '3',
    clientName: 'Sunrise Energy',
    clientType: 'Enterprise',
    email: 'info@sunriseenergy.ng',
    phone: '+234 803 456 7890',
    contactPerson: 'Jennifer Nwankwo',
    potentialEmployees: 310,
    assignedTo: 'Chioma Eze',
    logNote: 'Budget review ongoing. Next call in 3 days.',
    status: 'Converted',
    dateAdded: '2026-03-29',
  },
  {
    id: '4',
    clientName: 'FreshLife Pharmacy',
    clientType: 'SMB',
    email: 'support@freshlife.com',
    phone: '+234 804 567 8901',
    contactPerson: 'Precious Eze',
    potentialEmployees: 19,
    assignedTo: 'Kemi Oladipo',
    logNote: 'Client requested pricing only; follow up next week.',
    status: 'Lost',
    dateAdded: '2026-03-21',
  },
];

export function updateLeadStatus(id: string, status: LeadStatus) {
  const lead = mockLeads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
  }
}
