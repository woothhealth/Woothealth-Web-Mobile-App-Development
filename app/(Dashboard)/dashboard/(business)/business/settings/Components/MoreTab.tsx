import MorePanel from "./MorePanel"

interface SLADocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  validUntil: string;
  uploadedDate: string;
  status: string;
}

interface PaymentMethod {
  id: string;
  cardType: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  addedDate: string;
  status: string;
}

interface MoreTabProps {
  slaDocuments: SLADocument[];
  paymentMethods: PaymentMethod[];
  onDeleteSLADocument: (docId: string) => Promise<void>;
  onDeletePaymentMethod: (methodId: string) => Promise<void>;
  onUploadSLADocument: (doc: SLADocument) => void;
}

export default function MoreTab({
  slaDocuments,
  paymentMethods,
  onDeleteSLADocument,
  onDeletePaymentMethod,
  onUploadSLADocument,
}: MoreTabProps) {
  return (
    <MorePanel
      slaDocuments={slaDocuments}
      paymentMethods={paymentMethods}
      onDeleteSLADocument={onDeleteSLADocument}
      onDeletePaymentMethod={onDeletePaymentMethod}
      onUploadSLADocument={onUploadSLADocument}
    />
  )
}