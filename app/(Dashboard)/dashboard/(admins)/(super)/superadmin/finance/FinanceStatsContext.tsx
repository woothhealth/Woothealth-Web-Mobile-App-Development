'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FinanceStats {
  moneyGenerated: number;
  receivables: number;
  totalRevenue: number;
  refundRequest: number;
}

interface FinanceStatsContextType {
  stats: FinanceStats | null;
  loading: boolean;
  error: string | null;
}

const FinanceStatsContext = createContext<FinanceStatsContextType | undefined>(undefined);

export const FinanceStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinanceStats = async () => {
      try {
        const response = await fetch('/api/admin/finance');
        if (response.ok) {
          const data = await response.json();
          const invoices = data.data || [];
          
          const moneyGenerated = invoices
            .filter((invoice: any) => invoice.status === 'Paid')
            .reduce((sum: number, inv: any) => sum + inv.amount, 0);
          
          const receivables = invoices
            .filter((invoice: any) => invoice.status !== 'Paid')
            .reduce((sum: number, inv: any) => sum + inv.amount, 0);
          
          const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0);
          
          const refundRequest = invoices
            .filter((invoice: any) => invoice.status === 'Refund Request')
            .length;

          setStats({
            moneyGenerated,
            receivables,
            totalRevenue,
            refundRequest,
          });
        } else {
          setError('Failed to fetch finance stats');
          setStats({ moneyGenerated: 0, receivables: 0, totalRevenue: 0, refundRequest: 0 });
        }
      } catch (err) {
        console.error('Network error fetching finance stats:', err);
        setError('Network error');
        setStats({ moneyGenerated: 0, receivables: 0, totalRevenue: 0, refundRequest: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceStats();
  }, []);

  return (
    <FinanceStatsContext.Provider value={{ stats, loading, error }}>
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
