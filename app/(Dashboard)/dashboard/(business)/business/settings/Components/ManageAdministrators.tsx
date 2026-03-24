'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiPlus, FiMoreVertical } from 'react-icons/fi'
import { IoIosArrowForward } from 'react-icons/io'
import AddAdministratorModal from '../../UIs/AddAdministratorModal'
import { toast } from 'sonner'

type Administrator = {
  id: string
  name: string
  role: string
  email: string
  position: string
  status?: string
  addedDate?: string
}

export default function ManageAdministrators() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [administrators, setAdministrators] = useState<Administrator[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch administrators on mount
  useEffect(() => {
    fetchAdministrators()
  }, [])

  const fetchAdministrators = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/business/profile/administrators')
      if (response.ok) {
        const data = await response.json()
        // API now returns array directly
        const adminList = Array.isArray(data) ? data : (data?.administrators || [])
        setAdministrators(adminList)
      } else {
        setError('Failed to fetch administrators')
        setAdministrators([])
      }
    } catch (err) {
      console.error('Failed to fetch administrators:', err)
      setError('Network error')
      setAdministrators([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddSuccess = (newAdmin: Administrator) => {
    toast.success('Administrator added successfully')
    setAdministrators(prev => [...prev, newAdmin])
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Account Administrators</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center md:gap-2 px-2 md:px-4 py-2 bg-[#49A5EF] text-[#ffffff] rounded-lg hover:bg-[#3a8bcf] transition-colors font-medium text-sm"
        >
          <FiPlus className="text-lg" />
          Add New
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#49A5EF] rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Loading administrators...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && administrators.length === 0 && !error && (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500 text-base">No administrators found</p>
        </div>
      )}

      {/* Administrators List */}
      {!loading && administrators.length > 0 && (
        <div className="space-y-3">
          {administrators.map((admin) => (
            <motion.div
              key={admin.id}
              className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              whileHover={{ backgroundColor: '#f9fafb' }}
            >
              <div className="flex justify-between flex-1">
                <div className='flex gap-4 flex-1'>
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-[#49A5EF1A] rounded-full flex items-center justify-center text-[#49A5EF] font-bold text-sm shrink-0">
                    {admin.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{admin.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{admin.position}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{admin.email}</p>
                    <div className="px-3 py-1 w-fit bg-blue-50 text-[#49A5EF] rounded-full text-xs mt-2 font-medium">
                      {admin.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 shrink-0">
                <IoIosArrowForward className="text-xl" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Administrator Modal */}
      <AddAdministratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </motion.section>
  )
}
