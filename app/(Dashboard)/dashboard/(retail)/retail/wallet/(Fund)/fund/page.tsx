'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'
import Image from 'next/image'

const Page = () => {

  const [formData, setFormData] = useState({
        amount: ''
      });
      const [errors, setErrors] = useState({
        amount: ''
      });
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isSubmitted, setIsSubmitted] = useState(false);
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        setFormData({
          ...formData,
          [target.name]: target.type === 'number' ? target.valueAsNumber : target.value
        });
        setErrors({
          ...errors,
          [target.name]: ''
        });
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = { amount: ''};
        let hasError = false;
    
        if (!formData.amount.trim()) {
          newErrors.amount = 'Field not filled';
          hasError = true;
        }
  
        setErrors(newErrors);
    
        if (hasError) return;
    
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);
          // Reset form after successful submission
          setFormData({
              amount: ''
          });
        }, 1500);
      };

  return (
    <section className='p-4'>
      <Link href='/dashboard/retail/wallet' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
      <div className='flex flex-col justify-center items-center mt-6'>
        <div className='flex flex-col gap-10'>
          <p className='text-[18px]'>Fund your wallet for seamless healthcare payments</p>
            <div className='pt-8 pb-10 px-6 bg-[#FFFFFF] rounded-[10px] flex gap-10 flex-col' style={{height: '20rem'}}>
              <div className='flex items-center justify-center gap-4'>
                <div className='p-1 rounded-full bg-[#49A5EF1A]'>
                  <Image src='/Paystack_img.png' alt='Paystack' width={100} height={100} className='h-8 w-fit' />
                </div>
                <h4 className='text-[24px] font-semibold'>Paystack</h4>
              </div>
              <form action="" className='flex flex-col gap-6' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2'>
                  <label htmlFor="amount">
                    Amount to fund
                  </label>
                  <input type="number" name='amount' className='bg-[#F8F9FA] border border-[#E5E7EB] rounded-[10px] px-2 py-1 outline-0' placeholder='0.00' value={formData.amount} onChange={handleChange} />
                  {errors.amount && <span className="text-red-500/60 text-sm">{errors.amount}</span>}
                </div>
                <input type="submit" value={`${isSubmitting ? 'Sending...' : 'Fund Onine'}`} className='btn py-2 rounded-2xl w-full cursor-pointer' disabled={isSubmitting}/>
              </form>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Page