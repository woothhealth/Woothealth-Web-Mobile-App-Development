'use client'

import Link from 'next/link';
import React, { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { LuEye, LuEyeClosed } from 'react-icons/lu';

const FormSection = () => {
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      state: '',
      address: '',
      password: '',
      age: '',
      check: false
  });
  const [errors, setErrors] = useState({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      state: '',
      address: '',
      password: '',
      age: '',
      check: '',
      general: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
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
      const newErrors = { firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      state: '',
      address: '',
      password: '',
      age: '',
      check: '',
      general: '' };
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
      if (!formData.password.trim()) {
        newErrors.password = 'Field not filled';
        hasError = true;
      }if (!formData.age.trim()) {
        newErrors.age = 'Field not selected';
        hasError = true;
      }
      if (!formData.check) {
        newErrors.check = 'Field not checked';
        hasError = true;
      }

      setErrors(newErrors);
  
      if (hasError) return;
  
      setIsSubmitting(true);
      
      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed');
        }
        if (data.role === 'retail') {
          setIsSubmitted(true);
        } else {
          setIsSubmitted(true);
        }
        
        setFormData({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          state: '',
          address: '',
          password: '',
          age: '',
          check: false
        });
        setErrors({
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          state: '',
          address: '',
          password: '',
          age: '',
          check: '',
          general: ''
        });
      } catch (err: any) {
        setErrors({ ...errors, general: err.message });
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <section className='relative min-h-screen mb-16'>
        <div className='relative flex flex-col items-center justify-center '>
            <div className='absolute top-0 bg-[#120052] py-14 px-8 w-full'>
            </div>
            <div className='absolute formDiv overflow-y-scroll h-screen md-h-full top-0 bg-[#FFFFFF] rounded-3xl py-10 px-8 lg:px-16 w-[90%] lg:w-[70%]'>
                {!isSubmitted && errors.general && (
                  <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2 text-center">
                    <span>{errors.general}</span>
                  </div>
                )}
                {isSubmitted ? (
                <div className="text-center border-green-200 py-4 mx-6 md:mx-0">
                  <FaCheckCircle className="h-16 w-16 text-green-600/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Registration Successful!
                  </h3>
                  <p className=" mb-6">
                    Your account has been created successfully. Please refer to your email for your credientials to successfully Log in.
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
                    <div className='flex flex-col md:flex-row gap-6 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="password">
                              Choose your Password
                            </label>
                            <div className='relative'>
                            <input type={showPassword? 'text' : 'password'} name='password' id="password" placeholder='Enter Your Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' value={formData.password} onChange={handleChange}/>
                            <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                              {showPassword ? <LuEyeClosed/> : <LuEye/>}
                            </button>
                            </div>
                            {errors.password && <span className="text-red-500/60 text-sm">{errors.password}</span>}
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <label className='font-semibold' htmlFor="age">
                              Age
                            </label>
                            <select name='age' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm' id="age" value={formData.age} onChange={handleChange}>
                              <option value="Select Age">Select your age</option>
                              <option value="18-25">18-25</option>
                              <option value="26-35">26-35</option>
                              <option value="35-45">36-45</option>
                              <option value="46-60">46-60</option>
                              <option value="61">61-65</option>
                            </select>
                            {errors.age && <span className="text-red-500/60 text-sm">{errors.age}</span>}
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
                        <label htmlFor="check" className='w-sm text-sm'>I have read and agreed to Woot Health’s Terms of Use and Privacy Policy <span className='text-red-500/60'>*</span></label>
                      </div>
                      {errors.check && <span className="text-red-500/60 text-sm">{errors.check}</span>}
                    </div>

                    <button type='submit' disabled={isSubmitting} className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-fit mt-1'>
                        {isSubmitting ? 'Sending...' : 'SUBMIT'}
                    </button>
                    <div>
                      <p className='md:text-lg'>Have an account? { " "}
                        <Link href={`/login`} className='text-[#49A5EF] underline'>Log in</Link>
                      </p>
                    </div>
                </form>
            </div>
            )}
            </div>
        </div>
    </section>
  )
}

export default FormSection