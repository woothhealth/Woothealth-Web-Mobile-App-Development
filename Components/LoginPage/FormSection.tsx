'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Link from 'next/link'
import { FaCheckCircle } from 'react-icons/fa'
import { API_BASE_URL } from '@/lib/api';
import { getCurrentUser, loginUser } from '@/lib/auth';
import { LuEye, LuEyeClosed } from 'react-icons/lu';

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
}

type Errors = {
  email?: string;
  password?: string;
  general?: string;
}

const FormSection: React.FC = () => {

  function sanitize(input: string) {
    return input.replace(/[\x00-\x1F\x7F]/g, '').trim()
  }

  function validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setErrors({ ...errors, [name]: '', general: '' });
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Field required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const email = sanitize(formData.email).toLowerCase()
    const password = sanitize(formData.password)
    if (!validate()) return;

    setLoading(true);

    // Basic validation
    const newErrors: Errors = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address'
    if (!password) newErrors.password = 'Password is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})

    try {
      await loginUser(email, password, rememberMe);
      const user = await getCurrentUser();

      if(!user) throw new Error("Authentication failed");

      if (user.role === "retail") {
        router.push("dashboard/retail");
      } else if (user.role === "business") {
        router.push("dashboard/business");
      } else {
        throw new Error("Unauthorized role");
      }
    } catch (err: any) {
      setErrors({ ...errors, general: err.message });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }

  return (
    <section className='relative min-h-[90svh] lg:min-h-[85svh] mb-16'>
      <div className='relative flex flex-col items-center justify-center '>
        <div className='absolute top-0 bg-[#120052] py-14 px-8 w-full'></div>
        <div className='absolute formDiv overflow-y-scroll md-h-full top-0 bg-[#FFFFFF] rounded-3xl py-8 px-6 lg:px-16 w-[90%] lg:w-[70%]'>
          {isSubmitted ? (
            <div className='text-center border-green-200 py-4 mx-6 md:mx-0'>
              <FaCheckCircle className='h-16 w-16 text-green-600/40 mx-auto mb-4' />
              <h3 className='text-xl font-semibold mb-2'>Login Successful!</h3>
              <p className=' mb-6'>Welcome back — you are now logged in.</p>
              <button onClick={() => setIsSubmitted(false)} className='bg-[#49A5EF]/780 text-white px-10 font-semibold py-3 rounded-sm'>
                Continue
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-2 '>
              <form onSubmit={handleSubmit} className='flex flex-col gap-8 items-center justify-center md:mx-0' aria-live='polite'>
                <div className='text-center'>
                  <h3 className='text-[24px] font-semibold'>We&apos;re glad to have <span className='text-[#49A5EF]'>you back</span></h3>
                  <p>Log in to manage your health insurance</p>
                </div>
                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='email' className='md:text-lg text-base'>Email</label>
                  <input
                    type='text'
                    placeholder='Enter Your Email address'
                    className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    autoComplete='email'
                  />
                  {errors.email && (
                    <span id='email-error' className='text-red-500/60 text-sm'>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className='flex flex-col gap-3 w-full'>
                  <label className='font-semibold' htmlFor="password">
                    Password
                  </label>
                  <div className='relative'>
                    <input type={showPassword? 'text' : 'password'} name='password' id="password" placeholder='Enter Your Password' className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm w-full' value={formData.password} onChange={handleChange}/>
                    <button type='button'className='absolute bottom-3 right-4 transition-all ease-in-out' onClick={()=> setShowPassword(!showPassword)}>
                      {showPassword ? <LuEyeClosed/> : <LuEye/>}
                    </button>
                  </div>
                  {errors.password && (
                    <span id='password-error' className='text-red-500/60 text-sm'>
                      {errors.password}
                    </span>
                  )}
                  <div className='flex justify-between mt-3 items-center'>
                    <label className='text-sm flex items-center gap-1'>
                      <input type="checkbox" name="rememberMe" onChange={(e) => setRememberMe(e.target.checked)} checked={rememberMe} /> Remember me
                    </label>
                    <Link href='/forgot-password' className='text-end text-sm text-[#49A5EF]'>Forgot Password?</Link>
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold rounded-sm w-full mt-1 disabled:opacity-50'
                >
                  {isSubmitting ? 'Signing in...' : 'LOGIN'}
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