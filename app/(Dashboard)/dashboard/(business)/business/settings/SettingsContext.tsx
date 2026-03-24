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

export interface SLADocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  validUntil: string;
  uploadedDate: string;
  status: string;
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
  slaDocuments: SLADocument[];
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string;
  reload: () => void;
  addSLADocument: (doc: SLADocument) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removeSession: (sessionId: string) => Promise<void>;
  deleteSLADocument: (docId: string) => Promise<void>;
  deletePaymentMethod: (methodId: string) => Promise<void>;
  changePassword: (newPassword: string, confirmPassword: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [slaDocuments, setSlaDocuments] = useState<SLADocument[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAllData = async () => {
    setLoading(true)
    setError('')

    try {
      const [sessionRes, slaRes, paymentRes] = await Promise.all([
        fetch('/api/business/settings/security'),
        fetch('/api/business/settings/sla'),
        fetch('/api/business/settings/payment-methods'),
      ])

      if (sessionRes.ok) {
        const data = await sessionRes.json()
        setSessions(Array.isArray(data) ? data : [])
      } else {
        setSessions([])
      }

      if (slaRes.ok) {
        const data = await slaRes.json()
        setSlaDocuments(Array.isArray(data) ? data : [])
      } else {
        setSlaDocuments([])
      }

      if (paymentRes.ok) {
        const data = await paymentRes.json()
        setPaymentMethods(Array.isArray(data) ? data : [])
      } else {
        setPaymentMethods([])
      }
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
      const response = await fetch(`/api/business/settings/security/${sessionId}`, { method: 'DELETE' })
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

  const deleteSLADocument = async (docId: string) => {
    try {
      const response = await fetch(`/api/business/settings/sla/${docId}`, { method: 'DELETE' })
      if (response.ok) {
        setSlaDocuments((prev) => prev.filter((d) => d.id !== docId))
        toast.success('SLA document deleted successfully')
      } else {
        toast.error('Failed to delete SLA document')
      }
    } catch (err) {
      console.error('SLA document deletion error:', err)
      toast.error('Failed to delete SLA document')
    }
  }

  const addSLADocument = (doc: SLADocument) => {
    setSlaDocuments((prev) => [doc, ...prev])
  }

  const addPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) => [method, ...prev])
  }

  const deletePaymentMethod = async (methodId: string) => {
    try {
      const response = await fetch(`/api/business/settings/payment-methods/${methodId}`, { method: 'DELETE' })
      if (response.ok) {
        setPaymentMethods((prev) => prev.filter((m) => m.id !== methodId))
        toast.success('Payment method deleted successfully')
      } else {
        const data = await response.json().catch(() => null)
        toast.error(data?.error || 'Failed to delete payment method')
      }
    } catch (err) {
      console.error('Payment method deletion error:', err)
      toast.error('Failed to delete payment method')
    }
  }

  const changePassword = async (newPassword: string, confirmPassword: string) => {
    try {
      const response = await fetch('/api/business/settings/security', {
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
        slaDocuments,
        paymentMethods,
        loading,
        error,
        reload: loadAllData,
        addSLADocument,
        addPaymentMethod,
        removeSession,
        deleteSLADocument,
        deletePaymentMethod,
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
