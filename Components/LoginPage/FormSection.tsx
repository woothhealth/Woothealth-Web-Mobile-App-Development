'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Link from 'next/link'
import { FaCheckCircle } from 'react-icons/fa'


const FormSection: React.FC = () => {

  type FormData = {
    email: string
    password: string
  }

  type Errors = {
    email?: string
    password?: string
    general?: string
  }

  function sanitize(input: string) {
    // Remove control characters and trim
    return input.replace(/[\x00-\x1F\x7F]/g, '').trim()
  }

  function validateEmail(email: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({ email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [loading, setLoading] = useState(false);

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

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   setFormData((s) => ({ ...s, [name]: value }))
  //   setErrors((s) => ({ ...s, [name]: undefined, general: undefined }))
  // }

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

    // Do not log password
    
    setIsSubmitting(true)
    setErrors({})

    try {
      const res = await fetch('https://woothealth.ekensloaded.com.ng/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await (async () => {
        try {
          return await res.json()
        } catch {
          return { ok: res.ok, message: res.statusText }
        }
      })()
      
      if (!res.ok) {
        if (res.status === 429) {
          setErrors({ general: data?.message || 'Too many requests. Slow down.' })
        } else if (res.status === 401) {
          // credentials incorrect
          setErrors({ general: data?.message || 'Invalid credentials' })
        } else {
          setErrors({ general: data?.message || 'Login failed. Try again later.' })
        }
        setIsSubmitting(false)
        return
      }

      setIsSubmitted(true)
      router.replace(
        data.user.role === 'retail'
          ? '/dashboard/retail'
          : '/dashboard/business'
      );
    } catch (err: any) {
      setErrors({ ...errors, general: err.message });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }

  return (
    <section className='relative min-h-[90svh] lg:min-h-[80svh] mb-16'>
      <div className='relative flex flex-col items-center justify-center '>
        <div className='absolute top-0 bg-[#120052] py-14 px-8 w-full'></div>
        <div className='absolute formDiv overflow-y-scroll md-h-full top-0 bg-[#FFFFFF] rounded-3xl py-10 px-8 lg:px-16 w-[90%] lg:w-[70%]'>
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
              <form onSubmit={handleSubmit} className='flex flex-col gap-8 items-center justify-center mx-2 md:mx-0' aria-live='polite'>
                <div className='text-center'>
                  <h3 className='text-[24px] font-semibold'>We&apos;re glad to have <span className='text-[#49A5EF]'>you back</span></h3>
                  <p>Log in to manage your health insurance</p>
                </div>
                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='email' className='text-lg'>Email</label>
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
                  <label className='text-lg' htmlFor='password'>Password</label>
                  <input
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    className='bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm'
                    id='password'
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error password-strength' : 'password-strength'}
                    autoComplete='current-password'
                    />
                  {errors.password && (
                    <span id='password-error' className='text-red-500/60 text-sm'>
                      {errors.password}
                    </span>
                  )}
                  <label>
                    <input type="checkbox" name="rememberMe" onChange={handleChange} /> Remember me
                  </label>
                  <Link href='/forgot-password' className='text-end text-sm text-[#49A5EF]'>Forgot Password?</Link>
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
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
      <input name="email" placeholder="Email" onChange={handleChange} />
      {errors.email && <p>{errors.email}</p>}

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      {errors.password && <p>{errors.password}</p>}

      

      {errors.general && <p>{errors.general}</p>}

      <button disabled={loading}>
        {loading ? 'Signing in...' : 'Login'}
      </button>
    </form>
    </section>
  )
}

export default FormSection