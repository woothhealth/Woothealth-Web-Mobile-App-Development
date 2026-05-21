'use client';

import React, { createContext, useContext } from 'react';
import { useAdminBenefits } from '@/lib/adminBenefits';

interface BenefitsStats {
  total: number;
  active: number;
  draft: number;
  totalEnrollees: number;
}

interface BenefitsStatsContextType {
  stats: BenefitsStats;
  loading: boolean;
  error: string | null;
}

const BenefitsStatsContext = createContext<BenefitsStatsContextType | undefined>(undefined);

export const BenefitsStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, error } = useAdminBenefits();

  const benefits = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const stats: BenefitsStats = {
    total: benefits.length,
    active: benefits.filter((benefit: any) => benefit.status === 'active').length,
    draft: benefits.filter((benefit: any) => benefit.status === 'draft').length,
    totalEnrollees: benefits.filter((benefit: any) => benefit.enrollees > 0).length,
  };

  return (
    <BenefitsStatsContext.Provider
      value={{
        stats,
        loading: isLoading,
        error: error instanceof Error ? error.message : null,
      }}
    >
      {children}
    </BenefitsStatsContext.Provider>
  );
};

export const useBenefitsStatsContext = () => {
  const context = useContext(BenefitsStatsContext);
  if (!context) {
    throw new Error('useBenefitsStatsContext must be used within a BenefitsStatsProvider');
  }
  return context;
};