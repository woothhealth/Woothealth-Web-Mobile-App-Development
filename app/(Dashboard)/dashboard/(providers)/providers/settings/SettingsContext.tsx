'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

export interface Session {
  id: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  browser: string;
  osName: string;
}

export interface PaymentMethod {
  id: string;
  cardType: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  addedDate: string;
  status: string;
}

interface SettingsContextType {
  sessions: Session[];
  loading: boolean;
  error: string;
  reload: () => void;
  removeSession: (sessionId: string) => Promise<void>;
  deletePaymentMethod?: (methodId: string) => Promise<void>;
  changePassword: (newPassword: string, confirmPassword: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAllData = async () => {
    setLoading(true)
    setError('')

    try {
      const [sessionRes] = await Promise.all([
        fetch('/api/pr/settings/security'),
      ])

      if (sessionRes.ok) {
        const data = await sessionRes.json()
        setSessions(Array.isArray(data) ? data : [])
      } else {
        setSessions([])
      }

      // payment methods are managed by the settings page itself
    } catch (err) {
      console.error('Settings data load error:', err)
      setError('Failed to load settings data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const removeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/pr/settings/security/${sessionId}`, { method: 'DELETE' })
      if (response.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId))
        toast.success('Session revoked successfully')
      } else {
        toast.error('Failed to revoke session')
      }
    } catch (err) {
      console.error('Session removal error:', err)
      toast.error('Failed to revoke session')
    }
  }

  // payment methods CRUD is handled in the page component

  const changePassword = async (newPassword: string, confirmPassword: string) => {
    try {
      const response = await fetch('/api/pr/settings/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      })

      if (response.ok) {
        toast.success('Password changed successfully')
      } else {
        const data = await response.json().catch(() => null)
        toast.error(data?.error || 'Failed to change password')
      }
    } catch (err) {
      console.error('Password change error:', err)
      toast.error('Failed to change password')
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        sessions,
        loading,
        error,
        reload: loadAllData,
        removeSession,
        changePassword,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within SettingsProvider')
  return context
}
