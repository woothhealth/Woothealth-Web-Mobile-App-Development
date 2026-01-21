'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'
import { FaCheckCircle } from 'react-icons/fa'

const Page = () => {

  const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        dob: '',
        dept: '',
        gender: '',
        plan: '',
        status: ''
      });
      const [errors, setErrors] = useState({
        name: '',
        email: '',
        number: '',
        dob: '',
        dept: '',
        gender: '',
        plan: '',
        status: ''
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
        email: '',
        number: '',
        dob: '',
        dept: '',
        gender: '',
        plan: '',
        status: '' };
        let hasError = false;
    
        if (!formData.name.trim()) {
          newErrors.name = 'Field not filled';
          hasError = true;
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Field not filled';
          hasError = true;
        }
        if (!formData.number.trim()) {
          newErrors.number = 'Field not filled';
          hasError = true;
        }
        if (!formData.dob.trim()) {
          newErrors.dob = 'Field not filled';
          hasError = true;
        }
        if (!formData.dept.trim()) {
          newErrors.dept = 'Field not filled';
          hasError = true;
        }
        if (!formData.gender.trim()) {
          newErrors.gender = 'Field not filled';
          hasError = true;
        }
        if (!formData.status.trim()) {
          newErrors.status = 'Field not filled';
          hasError = true;
        }
        if (!formData.plan.trim()) {
          newErrors.plan = 'Field not filled';
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
              email: '',
              number: '',
              dob: '',
              dept: '',
              gender: '',
              plan: '',
              status: ''
          });
        }, 1500);
      };
  
    return (
      <>
    <section className='py-4 md:p-4'>
      <Link href='/dashboard/business/employees' className='border p-1 rounded-full inline-flex'>
        <FaArrowLeft className='text-2xl'/>
      </Link>
      <div className='flex flex-col md:justify-center md:items-center mt-6'>
        <div className='flex flex-col gap-6 md:w-lg'>
          <p className='text-[18px] text-center md:text-start'>Add an employee? Complete the form below to begin their enrollment.</p>
            <div className='pt-3 md:pt-8 pb-10 px-6 bg-[#FFFFFF] rounded-[10px]'>
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
                        Employee Name
                      </label>
                      <input type="text" placeholder='Enter member&apos;s name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="name" name="name" value={formData.name} onChange={handleChange} />
                      {errors.name && <span className="text-red-500/60 text-sm">{errors.name}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor="email" className='font-semibold'>
                        Email Address
                      </label>
                      <input type="email" placeholder='Enter Email Address' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="email" name="email" value={formData.email} onChange={handleChange}/>
                      {errors.email && <span className="text-red-500/60 text-sm">{errors.email}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="number">
                        Phone Number
                      </label>
                      <input type="tel" name='number' placeholder='Enter phone number' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="number" value={formData.number} onChange={handleChange} />
                      {errors.number && <span className="text-red-500/60 text-sm">{errors.number}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="dept">
                        Department
                      </label>
                      <input type="text" name='dept' placeholder='Enter Department' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="dept" value={formData.dept} onChange={handleChange} />
                      {errors.dept && <span className="text-red-500/60 text-sm">{errors.dept}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="dob">
                        Date of Birth
                      </label>
                      <input type="date" name='dob' placeholder='Enter date of birth' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="dob" value={formData.dob} onChange={handleChange} />
                      {errors.dob && <span className="text-red-500/60 text-sm">{errors.dob}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="gender">
                        Gender
                      </label>
                      <select name='gender' id="gender" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && <span className="text-red-500/60 text-sm">{errors.gender}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="plan">
                        Plan
                      </label>
                      <select name='plan' id="plan" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formData.plan} onChange={handleChange}>
                        <option value="">Select Plan type</option>
                        <option value="Core">Core</option>
                        <option value="Sync">Sync</option>
                        <option value="Nexus">Nexus</option>
                        <option value="Quantum">Quantum</option>
                        <option value="Ignite">Ignite</option>
                      </select>
                      {errors.plan && <span className="text-red-500/60 text-sm">{errors.plan}</span>}
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label className='font-semibold' htmlFor="status">
                        Status
                      </label>
                      <select name='status' id="status" className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 selection:bg-black' value={formData.status} onChange={handleChange}>
                        <option value="">Select status type</option>
                        <option value="male">Active</option>
                        <option value="Female">Inactive</option>
                      </select>
                      {errors.status && <span className="text-red-500/60 text-sm">{errors.status}</span>}
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