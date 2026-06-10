'use client'

import React, { createContext, useContext } from 'react'
import { useAdminWallet } from '@/lib/api'

const AdminWalletContext = createContext<any>(null)

export function AdminWalletProvider({ children }: { children: React.ReactNode }) {
  const { data: walletData, isLoading, error, refetch } = useAdminWallet()

  const wallets = walletData?.data || []
  const total = walletData?.total || 0
  const totalBalance = walletData?.totalBalance ?? walletData?.balance ?? 0

  return (
    <AdminWalletContext.Provider value={{
      wallets,
      total,
      totalBalance,
      loading: isLoading,
      error,
      refetch
    }}>
      {children}
    </AdminWalletContext.Provider>
  )
}

export function useAdminWalletContext() {
  const ctx = useContext(AdminWalletContext)
  if (!ctx) {
    throw new Error('useAdminWalletContext must be used within AdminWalletProvider')
  }
  return ctx
}
