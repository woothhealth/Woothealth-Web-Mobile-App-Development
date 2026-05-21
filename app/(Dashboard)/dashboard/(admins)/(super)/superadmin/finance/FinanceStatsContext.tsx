'use client';

import React, { createContext, useContext } from 'react';
import { useAdminFinance } from '@/lib/adminFinance';

interface FinanceStats {
  moneyGenerated: number;
  receivables: number;
  totalRevenue: number;
  refundRequest: number;
}

interface FinanceStatsContextType {
  stats: FinanceStats;
  loading: boolean;
  error: string | null;
}

const FinanceStatsContext = createContext<FinanceStatsContextType | undefined>(undefined);

export const FinanceStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, error } = useAdminFinance();

  const invoices = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const stats: FinanceStats = {
    moneyGenerated: invoices
      .filter((invoice: any) => invoice.status === 'Paid')
      .reduce((sum: number, inv: any) => sum + inv.amount, 0),
    receivables: invoices
      .filter((invoice: any) => invoice.status !== 'Paid')
      .reduce((sum: number, inv: any) => sum + inv.amount, 0),
    totalRevenue: invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0),
    refundRequest: invoices.filter((invoice: any) => invoice.status === 'Refund Request').length,
  };

  return (
    <FinanceStatsContext.Provider
      value={{
        stats,
        loading: isLoading,
        error: error instanceof Error ? error.message : null,
      }}
    >
      {children}
    </FinanceStatsContext.Provider>
  );
};

export const useFinanceStats = () => {
  const context = useContext(FinanceStatsContext);
  if (!context) {
    throw new Error('useFinanceStats must be used within FinanceStatsProvider');
  }
  return context;
};
