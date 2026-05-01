'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { Lead, mockLeads } from '../mockLeads';

type LeadsStatsContextValue = {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  stats: {
    newLead: number;
    contacted: number;
    converted: number;
    lost: number;
    total: number;
  };
  loading: boolean;
};

const LeadsStatsContext = createContext<LeadsStatsContextValue | undefined>(undefined);

export function LeadsStatsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const stats = useMemo(
    () => ({
      newLead: leads.filter((lead) => lead.status === 'New Lead').length,
      contacted: leads.filter((lead) => lead.status === 'Contacted').length,
      converted: leads.filter((lead) => lead.status === 'Converted').length,
      lost: leads.filter((lead) => lead.status === 'Lost').length,
      total: leads.length,
    }),
    [leads]
  );

  return (
    <LeadsStatsContext.Provider value={{ leads, setLeads, stats, loading: false }}>
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
