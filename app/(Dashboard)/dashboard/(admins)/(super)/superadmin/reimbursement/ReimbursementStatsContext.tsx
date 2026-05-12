'use client';

import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { MOCK_REIMBURSEMENTS } from './(home)/mockReimbursements';

interface ReimbursementStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ReimbursementStatsContextType {
  stats: ReimbursementStats;
  loading: boolean;
  error: string | null;
}

const ReimbursementStatsContext = createContext<ReimbursementStatsContextType | undefined>(undefined);

export const ReimbursementStatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const stats = useMemo(() => {
    const total = MOCK_REIMBURSEMENTS.length;
    const pending = MOCK_REIMBURSEMENTS.filter((item) => item.status === 'pending').length;
    const approved = MOCK_REIMBURSEMENTS.filter((item) => item.status === 'approved').length;
    const rejected = MOCK_REIMBURSEMENTS.filter((item) => item.status === 'rejected').length;

    return {
      total,
      pending,
      approved,
      rejected,
    };
  }, []);

  return (
    <ReimbursementStatsContext.Provider value={{ stats, loading: false, error: null }}>
      {children}
    </ReimbursementStatsContext.Provider>
  );
};

export const useReimbursementStats = () => {
  const context = useContext(ReimbursementStatsContext);
  if (context === undefined) {
    throw new Error('useReimbursementStats must be used within a ReimbursementStatsProvider');
  }
  return context;
};
