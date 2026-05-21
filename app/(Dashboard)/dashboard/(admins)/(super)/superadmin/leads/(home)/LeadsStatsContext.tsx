'use client';

import { createContext, useContext, useMemo } from 'react';
import { useAdminLeads, Lead } from '@/lib/adminLeads';

type LeadsStatsContextValue = {
  leads: Lead[];
  stats: {
    newLead: number;
    contacted: number;
    converted: number;
    lost: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
};

const LeadsStatsContext = createContext<LeadsStatsContextValue | undefined>(undefined);

export function LeadsStatsProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useAdminLeads();
  const leads = data?.data ?? [];

  const stats = useMemo(
    () => ({
      newLead: leads.filter((lead : Lead) => lead.status === 'New Lead').length,
      contacted: leads.filter((lead : Lead) => lead.status === 'Contacted').length,
      converted: leads.filter((lead : Lead) => lead.status === 'Converted').length,
      lost: leads.filter((lead : Lead) => lead.status === 'Lost').length,
      total: leads.length,
    }),
    [leads]
  );

  return (
    <LeadsStatsContext.Provider
      value={{
        leads,
        stats,
        loading: isLoading,
        error: error instanceof Error ? error.message : error ?? null,
      }}
    >
      {children}
    </LeadsStatsContext.Provider>
  );
}

export function useLeadsStats() {
  const context = useContext(LeadsStatsContext);
  if (!context) {
    throw new Error('useLeadsStats must be used within LeadsStatsProvider');
  }
  return context;
}
