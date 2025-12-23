'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = { token: string }

const ResetForm = ({ token }: Props) => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    if (password !== confirm) return setError('Passwords do not match')

    setLoading(true)
    try {
      const res = await fetch('', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(((data as unknown) as Record<string, unknown>)?.message as string || 'Failed to reset password')
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleOk = () => {
    setSuccess(false)
    router.push('/login')
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Password reset</h3>
            <p className="text-sm text-gray-700 mb-4">Your password was updated successfully. You can now log in with your new password.</p>
            <div className="text-right">
              <button onClick={handleOk} className="px-4 py-2 bg-blue-600 text-white rounded">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResetForm