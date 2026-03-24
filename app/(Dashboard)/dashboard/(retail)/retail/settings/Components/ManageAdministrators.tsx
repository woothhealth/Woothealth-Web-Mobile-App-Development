'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiPlus, FiMoreVertical } from 'react-icons/fi'
import { IoIosArrowForward } from 'react-icons/io'
import AddAdministratorModal from '../../UIs/AddAdministratorModal'
import { toast } from 'sonner'

type Administrator = {
  id: string
  name: string
  role: string
  email: string
  accessLevel: string
}

const administrators: Administrator[] = [
  {
    id: '1',
    name: 'Oluwasuun Adeyemi',
    role: 'HR Director',
    email: 'seun.adeyemi@techcorp.com.ng',
    accessLevel: 'Full Access',
  },
  {
    id: '2',
    name: 'Ngozi Okonkwo',
    role: 'Benefits Manager',
    email: 'ngozi@techcorp.com.ng',
    accessLevel: 'Manage Employees',
  },
  {
    id: '3',
    name: 'Chukwudi Eze',
    role: 'Finance Manager',
    email: 'chukwudi@techcorp.com.ng',
    accessLevel: 'View & Pay Bills',
  },
]

export default function ManageAdministrators() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddSuccess = () => {
    toast.success('Administrator added successfully')
    setIsModalOpen(false)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col space-y-4 bg-[#ffffff] p-6 rounded-[5px] shadow-sm cursor-default"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Account Administrators</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#49A5EF] text-[#ffffff] rounded-lg hover:bg-[#3a8bcf] transition-colors font-medium text-sm"
        >
          <FiPlus className="text-lg" />
          Add New
        </button>
      </div>

      {/* Administrators List */}
      <div className="space-y-3">
        {administrators.map((admin) => (
          <motion.div
            key={admin.id}
            className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            whileHover={{ backgroundColor: '#f9fafb' }}
          >
            <div className="flex justify-between flex-1">
              <div className='flex gap-4'>
              {/* Avatar */}
                <div className="w-10 h-10 bg-[#49A5EF1A] rounded-full flex items-center justify-center text-[#49A5EF] font-bold text-sm">
                    {admin.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                    <p className="text-sm text-gray-500">{admin.role}</p>
                    <p className="text-xs text-gray-400 mt-1">{admin.email}</p>
                    <div className="px-3 py-1 w-fit bg-blue-50 text-[#49A5EF] rounded-full text-xs mt-2 font-medium">
                        {admin.accessLevel}
                    </div>
                </div>

                {/* Access Level Badge */}
                </div>
            </div>

            {/* Actions */}
            <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
              <IoIosArrowForward className="text-xl" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add Administrator Modal */}
      <AddAdministratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </motion.section>
  )
}
