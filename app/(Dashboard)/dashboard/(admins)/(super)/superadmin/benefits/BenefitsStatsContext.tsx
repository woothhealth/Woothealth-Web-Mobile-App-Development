'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BenefitsStats {
  total: number;
  active: number;
  draft: number;
  totalEnrollees: number;
}

interface BenefitsStatsContextType {
  stats: BenefitsStats | null;
  loading: boolean;
  error: string | null;
}

const BenefitsStatsContext = createContext<BenefitsStatsContextType | undefined>(undefined);

export const BenefitsStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<BenefitsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBenefitsStats = async () => {
      try {
        const response = await fetch('/api/admin/benefits');
        if (response.ok) {
          const data = await response.json();
          const benefits = data.data || [];
          const total = benefits.length;
          const active = benefits.filter((benefit: any) => benefit.status === 'active').length;
          const draft = benefits.filter((benefit: any) => benefit.status === 'draft').length;
          const totalEnrollees = benefits.filter((benefit: any) => benefit.enrollees > 0).length; // or some logic

          setStats({
            total,
            active,
            draft,
            totalEnrollees,
          });
        } else {
          setError('Failed to fetch benefits stats');
          setStats({ total: 0, active: 0, draft: 0, totalEnrollees: 0 });
        }
      } catch (err) {
        console.error('Network error fetching benefits stats:', err);
        setError('Network error');
        setStats({ total: 0, active: 0, draft: 0, totalEnrollees: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchBenefitsStats();
  }, []);

  return (
    <BenefitsStatsContext.Provider value={{ stats, loading, error }}>
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