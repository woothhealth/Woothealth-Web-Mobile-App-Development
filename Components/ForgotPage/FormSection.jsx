'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const FormSection = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const validateEmail = (mail) => {
    return /\S+@\S+\.\S+/.test(mail)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let hasError = false
    setError('')

    if (!validateEmail(email)) {
      setError('Field not filled')
      hasError = true
    }

    if (hasError) return


    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Something went wrong')

      setShowSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    router.push('/login')
  }

  return (
    <section className='relative min-h-[70svh] mb-16'>
      <div className='relative flex flex-col items-center justify-center '>
        <div className='absolute top-0 bg-[#120052] py-14 px-8 w-full'></div>
        <div className='absolute formDiv overflow-y-scroll md-h-full top-0 bg-[#FFFFFF] rounded-3xl py-10 px-8 lg:px-16 w-[90%] lg:w-[70%]'>
            <div className='flex flex-col gap-2'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8 items-center justify-center mx-2 md:mx-0' aria-live='polite'>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Forgot your Password</h2>
                        <p className="text-sm text-gray-600 mb-4">Provide your email address to continue</p>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                        <label className=" text-lg">Email</label>
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#F8F9FA] border border-[#E5E7EB] outline-0 rounded-lg px-2.5 py-2 placeholder:text-sm"
                        placeholder="Enter your email address"
                        />
                        {error && <p className="text-sm text-red-500/60">{error}</p>}
                    </div>

                    <button
                    type="submit"
                    className="bg-[#49A5EF] text-[#FFFFFF] px-12 py-3 font-semibold w-full mt-1 disabled:opacity-50"
                    disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>

                    <p className="text-sm text-center text-gray-600 mt-2">Remembered your password? <Link href="/login" className="text-blue-600">Login</Link></p>
                </form>
            </div>
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded shadow max-w-sm">
                        <h3 className="text-lg font-semibold mb-2">Check your email</h3>
                        <p className="text-sm text-gray-700 mb-4">
                        If that email is registered, a password reset link has been sent.
                        </p>
                        <div className="text-right">
                        <button onClick={handleCloseSuccess} className="px-4 py-2 bg-blue-600 text-white rounded">OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    </section>
  )
}

export default FormSection