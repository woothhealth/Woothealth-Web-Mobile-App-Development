'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ClaimsStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ClaimsStatsContextType {
  stats: ClaimsStats | null;
  loading: boolean;
  error: string | null;
}

const ClaimsStatsContext = createContext<ClaimsStatsContextType | undefined>(undefined);

export const ClaimsStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<ClaimsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaimsStats = async () => {
      try {
        const response = await fetch('/api/admin/claims');
        if (response.ok) {
          const data = await response.json();
          const claims = data.data || [];
          const total = claims.length;
          const pending = claims.filter((claim: any) => claim.status === 'pending').length;
          const approved = claims.filter((claim: any) => claim.status === 'approved').length;
          const rejected = claims.filter((claim: any) => claim.status === 'rejected').length;

          setStats({
            total,
            pending,
            approved,
            rejected,
          });
        } else {
          setError('Failed to fetch claims stats');
          setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
        }
      } catch (err) {
        console.error('Network error fetching claims stats:', err);
        setError('Network error');
        setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchClaimsStats();
  }, []);

  return (
    <ClaimsStatsContext.Provider value={{ stats, loading, error }}>
      {children}
    </ClaimsStatsContext.Provider>
  );
};

export const useClaimsStats = () => {
  const context = useContext(ClaimsStatsContext);
  if (context === undefined) {
    throw new Error('useClaimsStats must be used within a ClaimsStatsProvider');
  }
  return context;
};
