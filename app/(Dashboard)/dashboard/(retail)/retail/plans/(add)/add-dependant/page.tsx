'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'
import { FaCheckCircle } from 'react-icons/fa'

const Page = () => {

  const [formData, setFormData] = useState({
        name: '',
        relationship: '',
        gender: '',
        dob: ''
      });
      const [errors, setErrors] = useState({
        name: '',
        relationship: '',
        gender: '',
        dob: ''
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
        const newErrors = { name: '',
        relationship: '',
        gender: '',
        dob: ''};
        let hasError = false;
    
        if (!formData.name.trim()) {
          newErrors.name = 'Field not filled';
          hasError = true;
        }
        if (!formData.relationship.trim()) {
          newErrors.relationship = 'Field not filled';
          hasError = true;
        }
        if (!formData.gender.trim()) {
          newErrors.gender = 'Field not filled';
          hasError = true;
        }
        if (!formData.dob.trim()) {
          newErrors.dob = 'Field not filled';
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
              name: '',
              relationship: '',
              gender: '',
              dob: '',
          });
        }, 1500);
      };
  
    return (
      <>
    <section className='p-4'>
      <Link href='/dashboard/plans' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
      <div className='flex flex-col justify-center items-center mt-6'>
        <div className='flex flex-col gap-6' style={{width: '32rem'}}>
          <p className='text-[18px]'>Add famiy members to your health coverage</p>
            <div className='pt-8 pb-10 px-6 bg-[#FFFFFF] rounded-[10px]'>
              {isSubmitted ? (
                  <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                    <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Member added Successfully!
                    </h3>
                    <p className=" mb-6">
                      Thank you for the addition
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
                      <label htmlFor="name"className='font-semibold'>
                        Member&apos;s Name
                      </label>
                      <input type="text" placeholder='Enter member&apos;s name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="name" name="name" value={formData.name} onChange={handleChange} />
                      {errors.name && <span className="text-red-500/60 text-sm">{errors.name}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="relationship" className='font-semibold'>
                        Relationship
                      </label>
                      <input type="text" placeholder='Enter relationship' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="relationship" name="relationship" value={formData.relationship} onChange={handleChange}/>
                      {errors.relationship && <span className="text-red-500/60 text-sm">{errors.relationship}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="gender">
                        Gender
                      </label>
                      <select name='gender' id="gender" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formData.gender} onChange={handleChange}>
                        <option value="Select gender">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && <span className="text-red-500/60 text-sm">{errors.gender}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="dob">
                        Date of Birth
                      </label>
                      <input type="date" name='dob' placeholder='Enter date of birth' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="dob" value={formData.dob} onChange={handleChange} />
                      {errors.dob && <span className="text-red-500/60 text-sm">{errors.dob}</span>}
                    </div>
                    
                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm mt-3'>
                      {isSubmitting ? 'Sending...' : 'Add Dependant'}
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