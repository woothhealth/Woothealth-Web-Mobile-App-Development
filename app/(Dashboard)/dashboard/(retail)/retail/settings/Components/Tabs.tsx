'use client'

import { motion } from "framer-motion"

type TabsProps = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabs = ["Security", "More"]

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="relative mb-6 p-2 rounded-[5px] bg-[#ffffff]">
      {/* Tab buttons */}
      <div className="flex gap-2 bg-[#F8F9FA] w-fit rounded-[5px] py-1 px-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-gray-600 font-medium transition-colors  hover:text-gray-900 ${
              activeTab === tab ? 'bg-[#ffffff]' : ''
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}