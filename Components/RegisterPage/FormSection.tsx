'use client'


import React, { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { FaPhone } from 'react-icons/fa6'

const FormSection = () => {
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      state: '',
      address: '',
      check: false
    });
    const [errors, setErrors] = useState({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      state: '',
      address: '',
      check: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [target.name]: target.type === 'checkbox' ? target.checked : target.value
      });
      setErrors({
        ...errors,
        [target.name]: ''
      });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      let newErrors = { firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      state: '',
      address: '',
      check: '' };
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
      if (!formData.state.trim()) {
        newErrors.state = 'Field not filled';
        hasError = true;
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Field not filled';
        hasError = true;
      }
      if (!formData.check) {
        newErrors.check = 'Field not checked';
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
            state: '',
            address: '',
            check: false
        });
      }, 1500);
    };

  return (
    <section className='relative min-h-screen mb-16'>
        <div className='relative flex flex-col items-center justify-center '>
            <div className='absolute top-0 bg-[#120052] py-14 px-8 w-full'>
            </div>
            <div className='absolute formDiv overflow-y-scroll h-screen md-h-full top-0 bg-[#FFFFFF] rounded-3xl py-10 px-8 lg:px-16 w-[90%] lg:w-[70%]'>
                {isSubmitted ? (
                <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                  <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Registration Successful!
                  </h3>
                  <p className=" mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-[#49A5EF]/780 text-white px-10 font-semibold py-3 rounded-sm"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className='flex flex-col gap-2 '>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8 items-center justify-center mx-2 md:mx-0'>
                    <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label htmlFor="firstName"className='font-semibold'>
                                First Name
                            </label>
                            <input type="text" placeholder='Enter Your Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                            {errors.firstName && <span className="text-red-500/60 text-sm">{errors.firstName}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label htmlFor="lastName" className='font-semibold'>
                                Last Name
                            </label>
                            <input type="text" placeholder='Enter Your Last Name' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                            {errors.lastName && <span className="text-red-500/60 text-sm">{errors.lastName}</span>}
                        </div>
                      </div>
                      <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="phoneNumber">
                                Phone Number
                            </label>
                            <input type="tel" name='phoneNumber' id="phoneNumber" placeholder='Enter Your Phone Number' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' value={formData.phoneNumber} onChange={handleChange}/>
                            {errors.phoneNumber && <span className="text-red-500/60 text-sm">{errors.phoneNumber}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="email">
                                Email
                            </label>
                            <input type="email" name='email' placeholder='Email' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="email" value={formData.email} onChange={handleChange} />
                            {errors.email && <span className="text-red-500/60 text-sm">{errors.email}</span>}
                        </div>
                    </div>
                    <div className='flex gap-6 w-full flex-col md:flex-row'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="state">
                                State
                            </label>
                            <input type="state" name='state' placeholder='Enter State' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="state" value={formData.state} onChange={handleChange} />
                            {errors.state && <span className="text-red-500/60 text-sm">{errors.state}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="address">
                                Address
                            </label>
                            <textarea  placeholder='Enter your Address' name='address' className='resize-none h-20 bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-3 placeholder:text-sm' id="address" value={formData.address} onChange={handleChange} ></textarea>
                            {errors.address && <span className="text-red-500/60 text-sm">{errors.address}</span>}
                        </div>
                    </div>
                    <div className='w-full'>
                      <div className='flex items-center gap-2'>
                        <input type="checkbox" name="check" id="check" checked={formData.check} onChange={handleChange} />
                        <label htmlFor="check" className='w-sm text-sm'>I have read and agreed to Woot Health’s Terms of Use and Privacy Policy*</label>
                      </div>
                      {errors.check && <span className="text-red-500/60 text-sm">{errors.check}</span>}
                    </div>

                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-fit mt-1'>
                        {isSubmitting ? 'Sending...' : 'SUBMIT'}
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