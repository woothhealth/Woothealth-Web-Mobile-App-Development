'use client'

import React, { useState, useEffect } from 'react'
import { FaUser } from 'react-icons/fa6'
import { IoIosArrowForward } from 'react-icons/io'
import AddAdministratorModal from '../../UIs/AddAdministratorModal'
import { toast } from 'sonner'

interface Administrator {
  id: string
  name: string
  email: string
  position: string
  role: string
  status?: string
  addedDate?: string
}

const page = () => {
  const [administrators, setAdministrators] = useState<Administrator[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAdministrators = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/business/profile/administrators')
      if (!response.ok) throw new Error('Failed to load administrators')
      const data = await response.json()
      setAdministrators(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Admin fetch error', err)
      setError('Unable to load administrators at this time')
      setAdministrators([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdministrators()
  }, [])

  const handleAddSuccess = (newAdmin?: Administrator) => {
    toast.success('Administrator added successfully')
    if (newAdmin) {
      setAdministrators((prev) => [...prev, newAdmin])
    } else {
      loadAdministrators()
    }
    setIsModalOpen(false)
  }

  return (
    <section className='md:w-[60%] md:px-4 pb-6 bg-[#ffffff] rounded-[10px] p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold'>Account Administrators</h3>
        <div onClick={() => setIsModalOpen(true)} className='text-[#49A5EF] text-sm cursor-pointer'>
          Add New
        </div>
      </div>

      {loading ? (
        <div className='py-8 text-center text-gray-500'>Loading administrators...</div>
      ) : error ? (
        <div className='py-8 text-center text-red-500'>{error}</div>
      ) : administrators.length === 0 ? (
        <div className='py-8 text-center text-gray-500'>No administrators found.</div>
      ) : (
        <div className='space-y-4'>
          {administrators.map((item) => (
            <div key={item.id} className='flex justify-between border items-center border-[#D9D9D9] rounded-[10px] p-2'>
              <div className='flex gap-3'>
                <div className='bg-[#49A5EF1A] text-[#49A5EF] rounded-full w-10 h-10 flex items-center justify-center'>
                  <FaUser />
                </div>
                <div>
                  <h3 className='font-semibold text-lg'>{item.name}</h3>
                  <p className='text-base'>{item.position}</p>
                  <p className='text-[0.9rem]'>{item.email}</p>
                  <p className='text-[#49A5EF] text-xs'>{item.role}</p>
                </div>
              </div>
              <div>
                <IoIosArrowForward className='text-2xl text-gray-400' />
              </div>
            </div>
          ))}
        </div>
      )}

      <AddAdministratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

    </section>
  )
}

export default page