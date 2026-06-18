'use client'

import React, { useState, useEffect } from 'react'
import { FiEdit2, FiPlus } from 'react-icons/fi'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'sonner'

interface AccountDetails {
  bankName: string
  accountNumber: string
  accountHolderName: string
  branch: string
  accountType: string
}

interface AccountDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (details: AccountDetails) => void
  initialValues: AccountDetails
  isEditing: boolean
}

const defaultAccountDetails: AccountDetails = {
  bankName: '',
  accountNumber: '',
  accountHolderName: '',
  branch: '',
  accountType: '',
}

function AccountDetailsModal({ isOpen, onClose, onSave, initialValues, isEditing }: AccountDetailsModalProps) {
  const [details, setDetails] = useState<AccountDetails>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof AccountDetails, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setDetails(initialValues)
    setErrors({})
  }, [initialValues, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDetails(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof AccountDetails, string>> = {}
    if (!details.bankName.trim()) nextErrors.bankName = 'Bank name is required.'
    if (!details.accountNumber.trim()) nextErrors.accountNumber = 'Account number is required.'
    if (!details.accountHolderName.trim()) nextErrors.accountHolderName = 'Account holder name is required.'
    if (!details.branch.trim()) nextErrors.branch = 'Branch is required.'
    if (!details.accountType.trim()) nextErrors.accountType = 'Account type is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setTimeout(() => {
      onSave(details)
      setIsSubmitting(false)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{isEditing ? 'Edit Account Details' : 'Add Account Details'}</h2>
            <p className="text-sm text-gray-500">Provide bank and account information for payouts.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm text-gray-700">
              Bank Name
              <input
                name="bankName"
                value={details.bankName}
                onChange={handleChange}
                className="mt-2 rounded-xl border border-gray-200 bg-[#F8F9FA] px-3 py-2 outline-none focus:border-[#49A5EF]"
                placeholder="e.g. Woothealth Bank"
              />
              {errors.bankName && <span className="mt-1 text-red-500 text-xs">{errors.bankName}</span>}
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Account Number
              <input
                name="accountNumber"
                value={details.accountNumber}
                onChange={handleChange}
                className="mt-2 rounded-xl border border-gray-200 bg-[#F8F9FA] px-3 py-2 outline-none focus:border-[#49A5EF]"
                placeholder="e.g. 1234567890"
              />
              {errors.accountNumber && <span className="mt-1 text-red-500 text-xs">{errors.accountNumber}</span>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col text-sm text-gray-700">
              Account Holder Name
              <input
                name="accountHolderName"
                value={details.accountHolderName}
                onChange={handleChange}
                className="mt-2 rounded-xl border border-gray-200 bg-[#F8F9FA] px-3 py-2 outline-none focus:border-[#49A5EF]"
                placeholder="e.g. John Doe"
              />
              {errors.accountHolderName && <span className="mt-1 text-red-500 text-xs">{errors.accountHolderName}</span>}
            </label>
            <label className="flex flex-col text-sm text-gray-700">
              Branch
              <input
                name="branch"
                value={details.branch}
                onChange={handleChange}
                className="mt-2 rounded-xl border border-gray-200 bg-[#F8F9FA] px-3 py-2 outline-none focus:border-[#49A5EF]"
                placeholder="e.g. Victoria Island"
              />
              {errors.branch && <span className="mt-1 text-red-500 text-xs">{errors.branch}</span>}
            </label>
          </div>

          <label className="flex flex-col text-sm text-gray-700">
            Account Type
            <input
              name="accountType"
              value={details.accountType}
              onChange={handleChange}
              className="mt-2 rounded-xl border border-gray-200 bg-[#F8F9FA] px-3 py-2 outline-none focus:border-[#49A5EF]"
              placeholder="e.g. Savings, Current"
            />
            {errors.accountType && <span className="mt-1 text-red-500 text-xs">{errors.accountType}</span>}
          </label>

          <div className="flex md:justify-end mt-2">
            <button
              type="submit"
              className="rounded-xl w-full md:w-fit bg-[#49A5EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a8bcf] disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const page = () => {
  const [details, setDetails] = useState<AccountDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedDetails = typeof window !== 'undefined' ? localStorage.getItem('accountDetails') : null
    if (storedDetails) {
      try {
        setDetails(JSON.parse(storedDetails))
      } catch {
        setDetails(null)
      }
    }
    setLoading(false)
  }, [])

  const handleOpenModal = (edit = false) => {
    setIsEditing(edit)
    setIsModalOpen(true)
  }

  const handleSaveDetails = (savedDetails: AccountDetails) => {
    setDetails(savedDetails)
    if (typeof window !== 'undefined') {
      localStorage.setItem('accountDetails', JSON.stringify(savedDetails))
    }
    toast.success('Account details saved successfully')
    setIsModalOpen(false)
  }

  return (
    <section className='md:w-[60%] md:px-4 pb-6 bg-white rounded-[10px] p-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6'>
        <div>
          <h3 className='text-lg font-semibold'>Account Details</h3>
          <p className='text-sm text-gray-500'>Add or edit payout bank information for this profile.</p>
        </div>
        <button
          type='button'
          onClick={() => handleOpenModal(!!details)}
          className='inline-flex items-center gap-2 rounded-xl bg-[#49A5EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a8bcf] transition'
        >
          {details ? <><FiEdit2 /> Edit Details</> : <><FiPlus /> Add Details</>}
        </button>
      </div>

      {loading ? (
        <div className='py-8 text-center text-gray-500'>Loading account details...</div>
      ) : !details ? (
        <div className='rounded-[10px] border border-dashed border-gray-300 bg-[#FBFCFE] p-6 text-center'>
          <p className='text-gray-600'>No account details have been added yet.</p>
          <button
            type='button'
            onClick={() => handleOpenModal(false)}
            className='mt-4 inline-flex items-center gap-2 rounded-xl bg-[#49A5EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3a8bcf] transition'
          >
            <FiPlus /> Add Account Details
          </button>
        </div>
      ) : (
        <div className='rounded-[10px] border border-[#E5E7EB] bg-[#F8FAFC] p-6'>
          <div className='flex items-start justify-between gap-4 pb-4 border-b border-gray-200'>
            <div>
              <h4 className='text-base font-semibold text-gray-900'>Bank Information</h4>
              <p className='text-sm text-gray-500'>Review the saved account details for payout processing.</p>
            </div>
            <button
              type='button'
              onClick={() => handleOpenModal(true)}
              className='inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition'
            >
              <FiEdit2 /> Edit
            </button>
          </div>

          <div className='mt-6 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-[10px] bg-white p-4 shadow-sm'>
              <p className='text-sm text-gray-500'>Bank Name</p>
              <p className='mt-2 text-base font-semibold text-gray-900'>{details.bankName}</p>
            </div>
            <div className='rounded-[10px] bg-white p-4 shadow-sm'>
              <p className='text-sm text-gray-500'>Account Number</p>
              <p className='mt-2 text-base font-semibold text-gray-900'>{details.accountNumber}</p>
            </div>
            <div className='rounded-[10px] bg-white p-4 shadow-sm'>
              <p className='text-sm text-gray-500'>Account Holder</p>
              <p className='mt-2 text-base font-semibold text-gray-900'>{details.accountHolderName}</p>
            </div>
            <div className='rounded-[10px] bg-white p-4 shadow-sm'>
              <p className='text-sm text-gray-500'>Branch</p>
              <p className='mt-2 text-base font-semibold text-gray-900'>{details.branch}</p>
            </div>
            <div className='rounded-[10px] bg-white p-4 shadow-sm sm:col-span-2'>
              <p className='text-sm text-gray-500'>Account Type</p>
              <p className='mt-2 text-base font-semibold text-gray-900'>{details.accountType}</p>
            </div>
          </div>
        </div>
      )}

      <AccountDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDetails}
        initialValues={details || defaultAccountDetails}
        isEditing={!!details}
      />
    </section>
  )
}

export default page