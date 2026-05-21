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

export const EnrolleesStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      try {
        const response = await fetch('/api/admin/enrollees');
        if (response.ok) {
          const data = await response.json();
          const enrollees = Array.isArray(data?.data) ? data.data as Array<{ status?: string }> : [];
          const activeCount = enrollees.filter((enrollee) => enrollee?.status?.toLowerCase() === 'active').length;
          const inactiveCount = enrollees.filter((enrollee) => enrollee?.status?.toLowerCase() === 'inactive').length;

          setStats({
            active: data.stats?.active ?? activeCount,
            totalEnrollees: data.stats?.totalEnrollees ?? data.total ?? enrollees.length,
            slotsAvailable: data.stats?.slotsAvailable ?? inactiveCount,
          });
        } else {
          setError('Failed to fetch enrollee stats');
          setStats({ active: 0, totalEnrollees: 0, slotsAvailable: 0 });
        }
      } catch (err) {
        console.error('Network error fetching enrollee stats:', err);
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
