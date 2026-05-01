'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [stats, setStats] = useState<TicketsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketsStats = async () => {
      try {
        const response = await fetch('/api/admin/tickets');
        if (response.ok) {
          const data = await response.json();
          const tickets = data.data || [];
          const total = tickets.length;
          const open = tickets.filter((ticket: any) => ticket.status === 'open').length;
          const progress = tickets.filter((ticket: any) => ticket.status === 'progress').length;
          const resolved = tickets.filter((ticket: any) => ticket.status === 'resolved').length;

          setStats({
            total,
            open,
            progress,
            resolved,
          });
        } else {
          setError('Failed to fetch tickets stats');
          setStats({ total: 0, open: 0, progress: 0, resolved: 0 });
        }
      } catch (err) {
        console.error('Network error fetching tickets stats:', err);
        setError('Network error');
        setStats({ total: 0, open: 0, progress: 0, resolved: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsStats();
  }, []);

  return (
    <TicketsStatsContext.Provider value={{ stats, loading, error }}>
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