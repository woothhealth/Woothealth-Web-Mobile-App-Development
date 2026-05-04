export interface PaCode {
  id: string;
  authorizationCode: string;
  dateOfService: string;
  hmoid: string;
  patientName: string;
  careType: string;
  status: 'approved' | 'under review' | 'declined';
  diagnosis: string;
  providerName: string;
  requestedBy: string;
  totalAmount: number;
  treatment: Array<{
    itemCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  createdDate: string;
  patientEmail?: string;
  patientPlan?: string;
}
