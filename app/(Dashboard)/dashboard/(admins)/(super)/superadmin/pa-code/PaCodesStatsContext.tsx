'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type PaCode = {
  $id: string;
  status?: string;
};

interface PaCodeStats {
  approved: number;
  underReview: number;
  declined: number;
}

interface PaCodeStatsContextType {
  stats: PaCodeStats | null;
  loading: boolean;
  error: string | null;
}

const PaCodesStatsContext = createContext<PaCodeStatsContextType | undefined>(undefined);

const parsePaCodes = (docs: any[]): PaCode[] =>
  docs.map((doc) => ({
    $id: doc.$id || doc.id || Math.random().toString(),
    status: doc.status || 'under review',
  }));

export const PaCodesStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<PaCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/pa-codes?page=1&limit=1000', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch pa-codes');
        const data = await res.json();

        let paCodes: any[] = [];
        if (data?.data && Array.isArray(data.data)) {
          paCodes = data.data;
        } else if (Array.isArray(data)) {
          paCodes = data;
        } else {
          console.warn('Unexpected pa-codes response structure:', data);
          paCodes = [];
        }

        const normalized = parsePaCodes(paCodes);
        const approvedCount = normalized.filter((paCode) => paCode.status === 'approved').length;
        const underReviewCount = normalized.filter((paCode) => paCode.status === 'under review').length;
        const declinedCount = normalized.filter((paCode) => paCode.status === 'declined').length;

        setStats({ approved: approvedCount, underReview: underReviewCount, declined: declinedCount });
      } catch (err) {
        console.error(err);
        setError('Failed to load pa-code stats');
        setStats({ approved: 0, underReview: 0, declined: 0 });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <PaCodesStatsContext.Provider value={{ stats, loading, error }}>
      {children}
    </PaCodesStatsContext.Provider>
  );
};

export const usePaCodesStats = () => {
  const context = useContext(PaCodesStatsContext);
  if (!context) throw new Error('usePaCodesStats must be used within PaCodesStatsProvider');
  return context;
};