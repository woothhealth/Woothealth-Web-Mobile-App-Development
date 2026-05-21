'use client'

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion, PanInfo } from "framer-motion"
import { useSettings } from "./SettingsContext"
import Tabs from "./Components/Tabs"
import SecurityTab from "./Components/SecurityTab"
import MoreTab from "./Components/MoreTab"

const tabs = ["Security", "More"]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Security")
  const [isDragging, setIsDragging] = useState(false)
  const { sessions, loading, error, removeSession, changePassword } = useSettings()

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
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    switch (tab) {
      case "Security":
        return (
          <SecurityTab
            sessions={sessions}
            onPasswordChange={changePassword}
            onRemoveSession={removeSession}
          />
        )
      case "More":
        return (
          <MoreTab/>
        )
      default:
        return (
          <SecurityTab
            sessions={sessions}
            onPasswordChange={changePassword}
            onRemoveSession={removeSession}
          />
        )
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
      </div>
    </div>
  )
}