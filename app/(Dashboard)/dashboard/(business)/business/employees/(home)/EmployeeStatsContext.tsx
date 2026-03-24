'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface EmployeeStats {
  active: number;
  totalEnrollees: number;
  slotsAvailable: number;
}

interface EmployeeStatsContextType {
  stats: EmployeeStats | null;
  loading: boolean;
  error: string | null;
}

const EmployeeStatsContext = createContext<EmployeeStatsContextType | undefined>(undefined);

export const EmployeeStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        const response = await fetch('/api/business/employees');
        if (response.ok) {
          const data = await response.json();
          setStats({
            active: data.stats?.active || 0,
            totalEnrollees: data.stats?.totalEnrollees || 0,
            slotsAvailable: data.stats?.slotsAvailable || 0,
          });
        } else {
          setError('Failed to fetch employee stats');
          setStats({ active: 0, totalEnrollees: 0, slotsAvailable: 0 });
        }
      } catch (err) {
        console.error('Network error fetching employee stats:', err);
        setError('Network error');
        setStats({ active: 0, totalEnrollees: 0, slotsAvailable: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeStats();
  }, []);

  return (
    <EmployeeStatsContext.Provider value={{ stats, loading, error }}>
      {children}
    </EmployeeStatsContext.Provider>
  );
};

export const useEmployeeStats = () => {
  const context = useContext(EmployeeStatsContext);
  if (context === undefined) {
    throw new Error('useEmployeeStats must be used within EmployeeStatsProvider');
  }
  return context;
};
