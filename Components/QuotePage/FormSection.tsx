'use client'

import React, { useState } from 'react'
import { FaCheckCircle, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { FaPhone } from 'react-icons/fa6'

const FormSection = () => {
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      company: '',
      companyAddress: '',
      employeeNumber: '',
      state: '',
      message: ''
    });
    const [errors, setErrors] = useState({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      company: '',
      companyAddress: '',
      employeeNumber: '',
      state: '',
      message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      let newErrors = { firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      company: '',
      companyAddress: '',
      employeeNumber: '',
      state: '',
      message: '' };
      let hasError = false;
  
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Field not filled';
        hasError = true;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Field not filled';
        hasError = true;
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = 'Field not filled';
        hasError = true;
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Field not filled';
        hasError = true;
      }
      if (!formData.company.trim()) {
        newErrors.company = 'Field not filled';
        hasError = true;
      }
      if (!formData.companyAddress.trim()) {
        newErrors.companyAddress = 'Field not filled';
        hasError = true;
      }
      if (!formData.employeeNumber.trim()) {
        newErrors.employeeNumber = 'Field not filled';
        hasError = true;
      }
      if (!formData.state.trim()) {
        newErrors.state = 'Field not filled';
        hasError = true;
      }
      if (!formData.message.trim()) {
        newErrors.message = 'Field not filled';
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
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          company: '',
          companyAddress: '',
          employeeNumber: '',
          state: '',
          message: ''
        });
      }, 1500);
    };

  return (
    <section className='relative min-h-screen'>
        <div className='relative flex flex-col items-center justify-center'>
            <div className='absolute top-0 bg-[#120052] py-10 px-8 w-full'>
            </div>
            <div className='absolute formDiv overflow-y-scroll top-0 bg-[#FFFFFF] rounded-3xl py-3 px-6 w-[70%]'>
                {isSubmitted ? (
                <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                  <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className=" mb-4">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-[#49A5EF]/780 text-white px-5 py-3 rounded-sm"
                  >
                    Get Another Quote
                  </button>
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 items-center justify-center mx-4 md:mx-0'>
                    <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="firstName">
                                First Name
                            </label>
                            <input type="text" placeholder='Enter Your Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <span className="text-red-500/60 text-sm">{errors.firstName}</span>}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="lastName">
                                Last Name
                            </label>
                            <input type="text" placeholder='Enter Your Last Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <span className="text-red-500/60 text-sm">{errors.lastName}</span>}
                        </div>
                      </div>
                      <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="phoneNumber">
                                Phone Number
                            </label>
                            <input type="tel" name='phoneNumber' id="phoneNumber" placeholder='Enter Your Phone Number' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' value={formData.phoneNumber} onChange={handleChange}/>
                            {errors.phoneNumber && <span className="text-red-500/60 text-sm">{errors.phoneNumber}</span>}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="email">
                                Email
                            </label>
                            <input type="email" name='email' placeholder='Email' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' id="email" value={formData.email} onChange={handleChange} />
                            {errors.email && <span className="text-red-500/60 text-sm">{errors.email}</span>}
                        </div>
                    </div>
                      <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="company">
                                Company Name
                            </label>
                            <input type="text" name='company' id="company" placeholder='Enter Your Company Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' value={formData.company} onChange={handleChange}/>
                            {errors.company && <span className="text-red-500/60 text-sm">{errors.company}</span>}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="company">
                                Company Address
                            </label>
                            <input type="text" name='companyAddress' id="companyAddress" placeholder='Enter your Company Address' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' value={formData.companyAddress} onChange={handleChange}/>
                            {errors.companyAddress && <span className="text-red-500/60 text-sm">{errors.companyAddress}</span>}
                        </div>
                    </div>
                    <div className='flex gap-6 w-full flex-col md:flex-row'>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="employeeNumber">
                                Employee Number
                            </label>
                            <input type="number" placeholder='How many employees do you have?' name='employeeNumber' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' id="employeeNumber" value={formData.employeeNumber} onChange={handleChange} />
                            {errors.employeeNumber && <span className="text-red-500/60 text-sm">{errors.employeeNumber}</span>}
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="state">
                                State
                            </label>
                            <input type="state" name='state' placeholder='Enter State' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1.5' id="state" value={formData.state} onChange={handleChange} />
                            {errors.state && <span className="text-red-500/60 text-sm">{errors.state}</span>}
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                            <label htmlFor="message">
                                Message
                            </label>
                            <textarea name='message' placeholder='Write a message' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-sm px-2.5 py-1 resize-none h-20' value={formData.message} onChange={handleChange}></textarea>
                            {errors.message && <span className="text-red-500/60 text-sm">{errors.message}</span>}
                    </div>

                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-8 py-3 rounded-sm w-fit mt-2'>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
            )}
            </div>
        </div>
    </section>
  )
}

export default FormSection