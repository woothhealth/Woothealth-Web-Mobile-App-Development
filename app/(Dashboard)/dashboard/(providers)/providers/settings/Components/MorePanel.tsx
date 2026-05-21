"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MoreMenu from "./MoreMenu";
import HelpPanel from "./HelpPanel";
import FaqPanel from "./FaqPanel";


export default function MorePanel() {
  const [activeMenu, setActiveMenu] = useState("help");

  const renderContent = () => {
    switch (activeMenu) {
      case "help":
        return <HelpPanel key="help" />;
      case "faq":
        return <FaqPanel key="faq" />;
      default:
        return <HelpPanel key="help" />;
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
