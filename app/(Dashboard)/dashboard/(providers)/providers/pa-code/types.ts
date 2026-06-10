export interface PaCode {
  id: string;
  authorizationCode: string;
  dateOfService: string;
  hmoid: string;
  patientName: string;
  patientId: string;
  careType: string;
  status: 'approved' | 'under review' | 'declined' | 'pending' | string;
  diagnosis: string;
  providerName: string;
  requestedBy: string;
  totalAmount: number;
  treatmentItems: Array<{
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
