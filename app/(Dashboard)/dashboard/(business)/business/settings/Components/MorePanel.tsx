"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MoreMenu from "./MoreMenu";
import ManageAdministrators from "./ManageAdministrators";
import UploadSLADocument from "./UploadSLADocument";
import PaymentMethodPanel from "./PaymentMethodPanel";
import TermsConditionsPanel from "./TermsConditionsPanel";
import PrivacyPolicyPanel from "./PrivacyPolicyPanel";

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

interface MorePanelProps {
  slaDocuments?: SLADocument[];
  paymentMethods?: PaymentMethod[];
  onDeleteSLADocument?: (docId: string) => void;
  onDeletePaymentMethod?: (methodId: string) => void;
  onUploadSLADocument?: (doc: SLADocument) => void;
}

export default function MorePanel({
  slaDocuments = [],
  paymentMethods = [],
  onDeleteSLADocument,
  onDeletePaymentMethod,
  onUploadSLADocument
}: MorePanelProps) {
  const [activeMenu, setActiveMenu] = useState("administrators");

  const renderContent = () => {
    switch (activeMenu) {
      case "administrators":
        return <ManageAdministrators key="administrators" />;
      case "sla":
        return (
          <UploadSLADocument
            key="sla"
            documents={slaDocuments}
            onDelete={onDeleteSLADocument}
            onUpload={(doc) => {
              if (onUploadSLADocument) {
                onUploadSLADocument(doc)
              }
            }}
          />
        );
      case "payment":
        return <PaymentMethodPanel key="payment" paymentMethods={paymentMethods} onDelete={onDeletePaymentMethod} />;
      case "terms":
        return <TermsConditionsPanel key="terms" />;
      case "privacy":
        return <PrivacyPolicyPanel key="privacy" />;
      default:
        return <ManageAdministrators key="administrators" />;
    }
  };

  return (
    <section className="relative lg:max-w-6xl mx-auto px-3 md:px-0">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Menu */}
        <div className="lg:w-[35%]">
          <MoreMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        </div>

        {/* Right Content Area */}
        <div className="lg:w-[60%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
