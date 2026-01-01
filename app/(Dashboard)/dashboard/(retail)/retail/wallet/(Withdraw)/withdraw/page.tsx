'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'
import Image from 'next/image'
import { FaCheckCircle } from 'react-icons/fa'

const Page = () => {

  const [formData, setFormData] = useState({
        amount: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        accountPassword: ''
      });
      const [errors, setErrors] = useState({
        amount: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        accountPassword: ''
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isSubmitted, setIsSubmitted] = useState(false);
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
        setErrors({
          ...errors,
          [target.name]: ''
        });
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = { amount: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        accountPassword: ''};
        let hasError = false;
    
        if (!formData.amount.trim()) {
          newErrors.amount = 'Field not filled';
          hasError = true;
        }
        if (!formData.bankName.trim()) {
          newErrors.bankName = 'Field not filled';
          hasError = true;
        }
        if (!formData.accountNumber.trim()) {
          newErrors.accountNumber = 'Field not filled';
          hasError = true;
        }
        if (!formData.accountName.trim()) {
          newErrors.accountName = 'Field not filled';
          hasError = true;
        }
        if (!formData.accountPassword.trim()) {
          newErrors.accountPassword = 'Field not filled';
          hasError = true;
        }
  
        setErrors(newErrors);
    
        if (hasError) return;
    
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
          console.log('Form submitted:', formData);
          setIsSubmitting(false);
          setIsSubmitted(true);
          // Reset form after successful submission
          setFormData({
              amount: '',
              bankName: '',
              accountNumber: '',
              accountName: '',
              accountPassword: '',
          });
        }, 1500);
      };
  
    return (
      <>
    <section className='p-4'>
      <Link href='/dashboard/wallet' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
      <div className='flex flex-col justify-center items-center mt-6'>
        <div className='flex flex-col gap-6' style={{width: '32rem'}}>
          <p className='text-[18px]'>Complete the form below to withdraw your funds. Processing typically takes 3-5 business days.</p>
            <div className='pt-8 pb-10 px-6 bg-[#FFFFFF] rounded-[10px]'>
              {isSubmitted ? (
                  <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                    <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Withdrawal form Successfully filled!
                    </h3>
                    <p className=" mb-6">
                      Your withdrawal request has been received and will be processed within the next 2-3 working days. Thank you
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[#49A5EF]/780 text-white px-10 font-semibold py-3 rounded-sm"
                    >
                      Go back
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-col gap-2'>
                  <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="amount"className='font-semibold'>
                        Amount to Withdraw
                      </label>
                      <input type="number" placeholder='0.00' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="amount" name="amount" value={formData.amount} onChange={handleChange} />
                      {errors.amount && <span className="text-red-500/60 text-sm">{errors.amount}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="bankName" className='font-semibold'>
                        Bank Name
                      </label>
                      <select className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 text-sm' id="bankName" name="bankName" value={formData.bankName} onChange={handleChange}>
                        <option value="Select your bank">Select your bank</option>
                        <option value="Wema bank">Wema Bank</option>
                        <option value="Access bank">Access Bank</option>
                      </select>
                      {errors.bankName && <span className="text-red-500/60 text-sm">{errors.bankName}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="accountNumber">
                        Account Number
                      </label>
                      <input type="number" name='accountNumber' id="accountNumber" placeholder='0123456789' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formData.accountNumber} onChange={handleChange}/>
                      {errors.accountNumber && <span className="text-red-500/60 text-sm">{errors.accountNumber}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="accountName">
                        Account Name
                      </label>
                      <input type="text" name='accountName' placeholder='Enter your account name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="accountName" value={formData.accountName} onChange={handleChange} />
                      {errors.accountName && <span className="text-red-500/60 text-sm">{errors.accountName}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="accountPassword">
                        Account password
                      </label>
                      <input type="password" name='accountPassword' placeholder='Enter your password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="accountPassword" value={formData.accountPassword} onChange={handleChange} />
                      {errors.accountPassword && <span className="text-red-500/60 text-sm">{errors.accountPassword}</span>}
                    </div>
                    
                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm mt-3'>
                      {isSubmitting ? 'Sending...' : 'Continue'}
                    </button>
                </form>
              </div>
              )}
              </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default Page