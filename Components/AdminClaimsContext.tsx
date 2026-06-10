'use client'

import React, { createContext, useContext } from 'react'
import { useAdminClaims } from '@/lib/api'

const AdminClaimsContext = createContext<any>(null)

export function AdminClaimsProvider({ children }: { children: React.ReactNode }) {
  const { data: claimsData, isLoading, error, refetch } = useAdminClaims()

  const claims = claimsData?.data || []
  const total = claimsData?.total || 0
  const claimsPrice = claimsData?.totalPrice || 0

  return (
    <AdminClaimsContext.Provider value={{
      claims,
      total,
      claimsPrice,
      loading: isLoading,
      error,
      refetch
    }}>
      {children}
    </AdminClaimsContext.Provider>
  )
}

export function useAdminClaimsContext() {
  const ctx = useContext(AdminClaimsContext)
  if (!ctx) {
    throw new Error('useAdminClaimsContext must be used within AdminClaimsProvider')
  }
  return ctx
}