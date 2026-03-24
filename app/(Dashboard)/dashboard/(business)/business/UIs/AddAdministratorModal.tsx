'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronDown } from 'react-icons/fi'
import { AddAdministratorInput, addAdministratorSchema } from '@/lib/api/validator/addAdministrator'

type AddAdministratorModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newAdmin: Administrator) => void
}

type Administrator = {
  id: string
  name: string
  email: string
  position: string
  role: string
  status?: string
  addedDate?: string
}

const roles = [
  { value: 'hr-director', label: 'HR Director' },
  { value: 'benefits-manager', label: 'Benefits Manager' },
  { value: 'finance-manager', label: 'Finance Manager' },
  { value: 'it-admin', label: 'IT Administrator' },
  { value: 'operations-manager', label: 'Operations Manager' },
  { value: 'compliance-officer', label: 'Compliance Officer' },
]

export default function AddAdministratorModal({ isOpen, onClose, onSuccess }: AddAdministratorModalProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)

  const [formInput, setFormInput] = useState<AddAdministratorInput>({
    name: '',
    position: '',
    email: '',
    role: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormInput(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleRoleSelect = (roleValue: string) => {
    setFormInput(prev => ({ ...prev, role: roleValue }))
    setFieldErrors(prev => ({ ...prev, role: '' }))
    setShowRoleDropdown(false)
  }

  const getSelectedRoleLabel = () => {
    const selectedRole = roles.find(role => role.value === formInput.role)
    return selectedRole ? selectedRole.label : 'Select Role'
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrorMessage('')
    setMessage('')
    setFieldErrors({})
    setIsSubmitting(true)

    const result = addAdministratorSchema.safeParse(formInput)

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        errors[issue.path[0] as string] = issue.message
      })
      setFieldErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/business/profile/administrators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formInput),
      })

      const data = await res.json()

      if (res.status === 201 || res.ok) {
        setIsSubmitted(true)
        setMessage(data?.message || 'Administrator added successfully!')
        // Create administrator object from form input and response
        const newAdmin: Administrator = {
          id: data.id || `admin_${Date.now()}`,
          name: formInput.name,
          email: formInput.email,
          position: formInput.position,
          role: formInput.role,
          status: data?.status || 'active',
          addedDate: data?.addedDate || new Date().toISOString().split('T')[0]
        }
        setTimeout(() => {
          onClose()
          onSuccess?.(newAdmin)
        }, 2000)
      } else if (res.status === 409) {
        setErrorMessage(data?.message || data?.error || 'Administrator already exists.')
      } else {
        setErrorMessage(data?.message || data?.error || 'Failed to add administrator. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setErrorMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormInput({
        name: '',
        position: '',
        email: '',
        role: '',
      })
      setFieldErrors({})
      setErrorMessage('')
      setMessage('')
      setIsSubmitted(false)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Add Administrator</h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FiX className="text-xl text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {errorMessage && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                      </div>
                    )}

                    {/* Name Field */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="font-semibold text-gray-900">
                        Administrator Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter full name"
                        className="bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-3 py-2 placeholder:text-sm focus:border-[#49A5EF] focus:ring-1 focus:ring-[#49A5EF] transition-colors"
                        value={formInput.name}
                        onChange={handleChange}
                      />
                      {fieldErrors.name && (
                        <span className="text-red-500/60 text-sm">{fieldErrors.name}</span>
                      )}
                    </div>

                    {/* Position Field */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="position" className="font-semibold text-gray-900">
                        Position
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        placeholder="e.g. HR Manager, IT Director"
                        className="bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-3 py-2 placeholder:text-sm focus:border-[#49A5EF] focus:ring-1 focus:ring-[#49A5EF] transition-colors"
                        value={formInput.position}
                        onChange={handleChange}
                      />
                      {fieldErrors.position && (
                        <span className="text-red-500/60 text-sm">{fieldErrors.position}</span>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="font-semibold text-gray-900">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="admin@company.com"
                        className="bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-3 py-2 placeholder:text-sm focus:border-[#49A5EF] focus:ring-1 focus:ring-[#49A5EF] transition-colors"
                        value={formInput.email}
                        onChange={handleChange}
                      />
                      {fieldErrors.email && (
                        <span className="text-red-500/60 text-sm">{fieldErrors.email}</span>
                      )}
                    </div>

                    {/* Role Select */}
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-gray-900">
                        Role & Access Level
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                          className="w-full bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-3 py-2 text-left flex items-center justify-between focus:border-[#49A5EF] focus:ring-1 focus:ring-[#49A5EF] transition-colors"
                        >
                          <span className={formInput.role ? 'text-gray-900' : 'text-gray-500'}>
                            {getSelectedRoleLabel()}
                          </span>
                          <FiChevronDown className={`text-gray-500 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        <AnimatePresence>
                          {showRoleDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                            >
                              {roles.map((role) => (
                                <button
                                  key={role.value}
                                  type="button"
                                  onClick={() => handleRoleSelect(role.value)}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                >
                                  {role.label}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {fieldErrors.role && (
                        <span className="text-red-500/60 text-sm">{fieldErrors.role}</span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#49A5EF] text-white py-3 rounded-lg font-semibold hover:bg-[#3a8bcf] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Adding Administrator...' : 'Add Administrator'}
                    </button>
                  </form>
                ) : (
                  /* Success State */
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Administrator Added!</h3>
                    <p className="text-gray-600 text-sm">{message}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}