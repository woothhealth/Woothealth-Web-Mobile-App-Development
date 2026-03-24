'use client'

import { useState, useRef } from "react"
import { AnimatePresence, motion, PanInfo } from "framer-motion"
import Tabs from "./Components/Tabs"
import SecurityPanel from "./Components/SecurityPanel"
import BillingPanel from "./Components/BillingPanel"
import MorePanel from "./Components/MorePanel"

const tabs = ["Security", "Billing", "More"]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Security")
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const getCurrentTabIndex = () => tabs.indexOf(activeTab)
  const getNextTab = () => tabs[(getCurrentTabIndex() + 1) % tabs.length]
  const getPrevTab = () => tabs[(getCurrentTabIndex() - 1 + tabs.length) % tabs.length]

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    const swipeThreshold = 50
    const { offset, velocity } = info

    // Check if swipe is significant enough
    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0) {
        // Swipe right - go to previous tab
        setActiveTab(getPrevTab())
      } else {
        // Swipe left - go to next tab
        setActiveTab(getNextTab())
      }
    }
  }

  const getTabContent = (tab: string) => {
    switch (tab) {
      case "Security":
        return <SecurityPanel />
      case "Billing":
        return <BillingPanel />
      case "More":
        return <MorePanel />
      default:
        return <SecurityPanel />
    }
  }

  return (
    <div className="relative py-6 lg:max-w-6xl mx-auto">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        ref={containerRef}
        className="relative cursor-grab active:cursor-grabbing overflow-x-hidden"
      >
        <AnimatePresence mode="wait" custom={getCurrentTabIndex()}>
          <motion.div
            key={activeTab}
            custom={getCurrentTabIndex()}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ touchAction: 'pan-y' }}
          >
            {getTabContent(activeTab)}
          </motion.div>
        </AnimatePresence>

        {/* Drag feedback overlay
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-500/5 pointer-events-none flex items-center justify-center"
          >
            <div className="text-blue-500 text-sm font-medium flex items-center gap-2">
              <span>← Swipe for {getPrevTab()}</span>
              <span className="mx-2">•</span>
              <span>Swipe for {getNextTab()} →</span>
            </div>
          </motion.div>
        )} */}
      </div>

      {/* Swipe indicator dots */}
      {/* <div className="flex justify-center mt-6 space-x-2">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-2 h-2 rounded-full transition-colors ${
              activeTab === tab ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to ${tab} tab`}
          />
        ))} */}
      {/* </div> */}
    </div>
  )
}