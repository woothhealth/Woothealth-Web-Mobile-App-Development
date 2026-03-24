'use client'

import { motion } from 'framer-motion'
import { FiCreditCard, FiCheck } from 'react-icons/fi'
import { LuTrash2 } from 'react-icons/lu'
import { RiMastercardFill, RiVisaLine } from 'react-icons/ri'

type PaymentMethod = {
  id: string
  type: 'card' | 'bank'
  name: string
  icon: React.ReactNode
  lastFour: string
  expiryDate?: string
  isDefault: boolean
}

export default function PaymentMethod() {
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      icon: <RiVisaLine className="text-2xl text-blue-600" />,
      type: 'card',
      name: 'Visa Card',
      lastFour: '4242',
      expiryDate: '12/28',
      isDefault: true,
    },
    {
      id: '2',
      icon: <RiMastercardFill className="text-2xl text-[#EF4444]" />,
      type: 'bank',
      name: 'Tech Corp Business Account',
      lastFour: '5678',
      expiryDate: '2/27',
      isDefault: false,
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col space-y-6 bg-[#ffffff] p-8 rounded-[10px]"
    >
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
          <p className="text-gray-500 text-sm mt-1">Select default payment method</p>
        </div>
        <button className='btn py-3 px-6'>
          Add Card
        </button>
      </div>

      {/* Payment Methods List */}
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className='flex justify-between items-center'>
          <motion.div
            className={`p-4 rounded-lg border-2 transition-colors cursor-pointer w-[93%] ${
              method.isDefault ? 'border-[#49A5EF] bg-[#49A5EF1A]' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
                    method.isDefault ? 'bg-blue-200 text-[#3B82F6]' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiCreditCard className="text-lg" />
                </div>

                {/* Details */}
                <div className='space-y-2'>
                  <div className="flex items-end gap-2">
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm ">
                      ••• {method.lastFour}
                    </p>
                  </div>
                  <p>
                    {method.expiryDate && ` • Expires ${method.expiryDate}`}
                  </p>
                </div>
              </div>

              {/* Default Badge */}
              {method.isDefault && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center p-1 bg-[#3B82F6] text-white rounded-full font-medium w-fit h-fit"
                >
                  <FiCheck className="text-sm font-bold" />
                </motion.div>
              )}
            </div>
          </motion.div>
        <LuTrash2 className='text-[#EF4444] text-2xl'/>
        </div>
        ))}
      </div>
    </motion.section>
  )
}
