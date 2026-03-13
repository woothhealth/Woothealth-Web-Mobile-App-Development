'use client'
// app/dashboard/settings/page.tsx
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Tabs from "./Components/Tabs"
import SecurityPanel from "./Components/SecurityPanel"
import BillingPanel from "./Components/BillingPanel"
import MorePanel from "./Components/MorePanel"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Security")

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "Security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <SecurityPanel />
            </motion.div>
          )}

          {activeTab === "Billing" && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <BillingPanel />
            </motion.div>
          )}

          {activeTab === "More" && (
            <motion.div
              key="more"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <MorePanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}