'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useAdminTickets } from '@/lib/adminTickets';

interface TicketsStats {
  total: number;
  open: number;
  progress: number;
  resolved: number;
}

interface TicketsStatsContextType {
  stats: TicketsStats | null;
  loading: boolean;
  error: string | null;
}

const TicketsStatsContext = createContext<TicketsStatsContextType | undefined>(undefined);

export const TicketsStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, error } = useAdminTickets();
  const tickets = data?.data ?? [];

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((ticket: any) => ticket.status === 'open').length;
    const progress = tickets.filter((ticket: any) => ticket.status === 'In progress').length;
    const resolved = tickets.filter((ticket: any) => ticket.status === 'resolved').length;

    return {
      total,
      open,
      progress,
      resolved,
    };
  }, [tickets]);

  return (
    <TicketsStatsContext.Provider
      value={{
        stats,
        loading: isLoading,
        error: error instanceof Error ? error.message : error ?? null,
      }}
    >
      {children}
    </TicketsStatsContext.Provider>
  );
};

export const useTicketsStatsContext = () => {
  const context = useContext(TicketsStatsContext);
  if (!context) {
    throw new Error('useTicketsStatsContext must be used within a TicketsStatsProvider');
  }
  return context;
};