'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Validation = {
  $id: string;
  status?: string;
};

interface ValidationStats {
  approved: number;
  declined: number;
}

interface ValidationStatsContextType {
  stats: ValidationStats | null;
  loading: boolean;
  error: string | null;
}

const ValidationsStatsContext = createContext<ValidationStatsContextType | undefined>(undefined);

const parseValidations = (docs: any[]): Validation[] =>
  docs.map((doc) => ({
    $id: doc.$id || doc.id || Math.random().toString(),
    status: doc.status || 'pending',
  }));

export const ValidationsStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<ValidationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/validations?page=1&limit=1000', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch validations');
        const data = await res.json();

        let validations: any[] = [];
        if (data?.data && Array.isArray(data.data)) {
          validations = data.data;
        } else if (Array.isArray(data)) {
          validations = data;
        } else {
          console.warn('Unexpected validations response structure:', data);
          validations = [];
        }

        const normalized = parseValidations(validations);
        const approvedCount = normalized.filter((validation) => validation.status === 'approved').length;
        const declinedCount = normalized.filter((validation) => validation.status === 'declined').length;

        setStats({ approved: approvedCount, declined: declinedCount });
      } catch (err) {
        console.error(err);
        setError('Failed to load validation stats');
        setStats({ approved: 0, declined: 0 });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <ValidationsStatsContext.Provider value={{ stats, loading, error }}>
      {children}
    </ValidationsStatsContext.Provider>
  );
};

export const useValidationsStats = () => {
  const context = useContext(ValidationsStatsContext);
  if (!context) throw new Error('useValidationsStats must be used within ValidationsStatsProvider');
  return context;
};