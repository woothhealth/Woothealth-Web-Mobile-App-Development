'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FaCheckCircle } from 'react-icons/fa'

type FormData = {
  email: string
  password: string
}

type Errors = {
  email?: string
  password?: string
  general?: string
}

const PASSWORD_MIN_LENGTH = 8
const MAX_FAILED_ATTEMPTS = 5
const BASE_COOLDOWN_MS = 60_000 // 1 minute

function sanitize(input: string) {
  // Remove control characters and trim
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim()
}

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function passwordStrength(password: string) {
  let score = 0
  if (password.length >= PASSWORD_MIN_LENGTH) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  // Score: 0..4
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  return { score, label: labels[score] || 'Very weak' }
}

const FormSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
  const [cooldownLeft, setCooldownLeft] = useState<number>(0)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // try to fetch CSRF token on mount (expects an endpoint that returns { csrfToken })
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/csrf', { credentials: 'include' })
        if (!mounted) return
        if (res.ok) {
          const json = await res.json()
          if (json && json.csrfToken) setCsrfToken(json.csrfToken)
        }
      } catch (err) {
        // silent: server may not provide csrf endpoint in every environment
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let timer: number | undefined
    if (lockoutUntil) {
      const update = () => {
        const left = Math.max(0, lockoutUntil - Date.now())
        setCooldownLeft(left)
        if (left <= 0) setLockoutUntil(null)
      }
      update()
      timer = window.setInterval(update, 1000)
    } else {
      setCooldownLeft(0)
    }
    return () => window.clearInterval(timer)
  }, [lockoutUntil])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((s) => ({ ...s, [name]: value }))
    setErrors((s) => ({ ...s, [name]: undefined, general: undefined }))
  }

  const setClientLockout = (attempts: number) => {
    // exponential backoff after MAX_FAILED_ATTEMPTS
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const extra = attempts - MAX_FAILED_ATTEMPTS
      const cooldown = BASE_COOLDOWN_MS * Math.pow(2, Math.min(extra, 4))
      setLockoutUntil(Date.now() + cooldown)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setErrors({ general: `Too many attempts. Try again in ${Math.ceil(cooldownLeft / 1000)}s.` })
      return
    }

    // Sanitize inputs
    const email = sanitize(formData.email).toLowerCase()
    const password = sanitize(formData.password)

    // Basic validation
    const newErrors: Errors = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < PASSWORD_MIN_LENGTH) newErrors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Do not log password
    
    setIsSubmitting(true)
    setErrors({})

    try {
      const body = { email, password }
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (csrfToken) headers['x-csrf-token'] = csrfToken

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(body),
      })

      const data = await (async () => {
        try {
          return await res.json()
        } catch {
          return { ok: res.ok, message: res.statusText }
        }
      })()

      if (!res.ok) {
        // handle common status codes
        if (res.status === 429) {
          setErrors({ general: data?.message || 'Too many requests. Slow down.' })
        } else if (res.status === 401) {
          // credentials incorrect
          const attempts = failedAttempts + 1
          setFailedAttempts(attempts)
          setClientLockout(attempts)
          setErrors({ general: data?.message || 'Invalid credentials' })
        } else {
          setErrors({ general: data?.message || 'Login failed. Try again later.' })
        }
        setIsSubmitting(false)
        return
      }

      // Successful login
      
      setIsSubmitted(true)
      setFailedAttempts(0)
      setLockoutUntil(null)
      // Clear sensitive data from state & input
      setFormData({ email: '', password: '' })
      if (passwordRef.current) passwordRef.current.value = ''
    } catch (err) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const strength = passwordStrength(formData.password)

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
                    ref={passwordRef}
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
                  <Link href='/forgot-password' className='text-end text-sm text-[#49A5EF]'>Forgot Password?</Link>

                  {/* Password Strength Indicator */}
                  <div id='password-strength' className='mt-2'>
                    <div className='w-full h-2 bg-gray-200 rounded overflow-hidden'>
                      <div
                        className={`h-full ${
                          strength.score >= 4
                            ? 'bg-green-500'
                            : strength.score >= 2
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                        }`} 
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                        aria-hidden
                      />
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>{strength.label}</p>
                  </div>
                </div>

                {errors.general && <div className='text-red-500/60 text-sm'>{errors.general}</div>}
                {lockoutUntil && cooldownLeft > 0 && (
                  <div className='text-orange-600 text-sm'>Please wait {Math.ceil(cooldownLeft / 1000)}s before retrying.</div>
                )}

                <button
                  type='submit'
                  disabled={isSubmitting || !!(lockoutUntil && cooldownLeft > 0)}
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