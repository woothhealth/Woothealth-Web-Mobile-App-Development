'use client'

import { FiUsers, FiFileText, FiCreditCard } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { IoIosArrowForward } from "react-icons/io";
import { LuScale } from 'react-icons/lu';
import { BsShieldFillExclamation } from 'react-icons/bs';

type MenuOption = {
  id: string
  label: string
  description: string
  icon: React.ReactNode
}

type MoreMenuProps = {
  activeMenu: string
  setActiveMenu: (menu: string) => void
}

const menuOptions: MenuOption[] = [
  {
    id: 'administrators',
    label: 'Manage Administrators',
    description: 'View and manage all administrators',
    icon: <FiUsers className="text-xl" />,
  },
  {
    id: 'sla',
    label: 'Upload SLA Document',
    description: 'View and upload new SLAs',
    icon: <FiFileText className="text-xl" />,
  },
  {
    id: 'payment',
    label: 'Payment Method',
    description: 'Select default payment method',
    icon: <FiCreditCard className="text-xl" />,
  },
  {
    id: 'terms',
    label: 'Terms & Conditions',
    description: 'View all terms & conditions',
    icon: <LuScale className="text-xl" />,
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    description: 'View privacy policy',
    icon: <BsShieldFillExclamation className="text-xl" />,
  },
]

export default function MoreMenu({ activeMenu, setActiveMenu }: MoreMenuProps) {
  return (
    <div className="flex bg-[#ffffff] rounded-[10px] p-4 flex-col gap-3">
      {menuOptions.map((option) => (
        <motion.div
          key={option.id}
          onClick={() => setActiveMenu(option.id)}
          className={`relative flex items-start gap-4 px-4 rounded-[10px] py-2 bg-white hover:border-blue-300 border cursor-default transition-colors text-left ${activeMenu === option.id ? 'border-[#49A5EF]' : 'border-gray-200'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Icon */}
          <div className={`p-3 rounded-full transition-colors bg-[#49A5EF1A] text-[#49A5EF]`}
          >
            {option.icon}
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className={`font-semibold text-sm text-gray-900`}>
              {option.label}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
          </div>

          {/* Arrow */}
          <motion.div
            className="text-gray-400"
            animate={{ x: activeMenu === option.id ? 4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowForward className="text-lg" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
