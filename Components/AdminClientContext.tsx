'use client'

import React, { createContext, useContext } from 'react'
import { useAdminClients } from '@/lib/api'

const AdminClientContext = createContext<any>(null)

export function AdminClientProvider({ children }: { children: React.ReactNode }) {
  const { data: clientsData, isLoading, error, refetch } = useAdminClients()

  const clients = clientsData?.data || []
  const total = clientsData?.total || 0

  return (
    <AdminClientContext.Provider value={{
      clients,
      total,
      loading: isLoading,
      error,
      refetch
    }}>
      {children}
    </AdminClientContext.Provider>
  )
}

export function useAdminClientContext() {
  const ctx = useContext(AdminClientContext)
  if (!ctx) {
    throw new Error('useAdminClientContext must be used within AdminClientProvider')
  }
  return ctx
}
