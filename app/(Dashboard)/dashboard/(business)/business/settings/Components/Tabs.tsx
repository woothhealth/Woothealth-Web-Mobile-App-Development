'use client'
// components/settings/Tabs.tsx
import { motion } from "framer-motion"

type TabsProps = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabs = ["Security", "Billing", "More"]

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="relative flex gap-6 border-b border-gray-300 mb-6">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="relative px-4 py-2 text-gray-600 font-medium"
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="active-tab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t"
            />
          )}
        </button>
      ))}
    </div>
  )
}