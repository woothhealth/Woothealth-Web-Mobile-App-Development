'use client';

import React, { createContext, useContext } from 'react';
import { useAdminPlans } from '@/lib/adminPlans';

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
  const { data, isLoading, error } = useAdminPlans();

  const plans = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  const stats: BenefitsStats = {
    total: plans.length,
    active: plans.filter((plan: any) => plan.status === 'active').length,
    draft: plans.filter((plan: any) => plan.status === 'draft').length,
    totalEnrollees: plans.filter((plan: any) => plan.enrollees > 0).length,
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