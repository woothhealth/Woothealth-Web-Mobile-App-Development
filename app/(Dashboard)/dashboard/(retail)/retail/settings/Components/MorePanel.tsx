"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MoreMenu from "./MoreMenu";
import ManageAdministrators from "./ManageAdministrators";
import UploadSLADocument from "./UploadSLADocument";
import PaymentMethodPanel from "./PaymentMethodPanel";
import TermsConditionsPanel from "./TermsConditionsPanel";
import PrivacyPolicyPanel from "./PrivacyPolicyPanel";

export default function MorePanel() {
  const [activeMenu, setActiveMenu] = useState("administrators");

  const renderContent = () => {
    switch (activeMenu) {
      case "administrators":
        return <ManageAdministrators key="administrators" />;
      case "sla":
        return <UploadSLADocument key="sla" />;
      case "payment":
        return <PaymentMethodPanel key="payment" />;
      case "terms":
        return <TermsConditionsPanel key="terms" />;
      case "privacy":
        return <PrivacyPolicyPanel key="privacy" />;
      default:
        return <ManageAdministrators key="administrators" />;
    }
  };

  return (
    <section className="relative lg:max-w-6xl mx-auto">
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
