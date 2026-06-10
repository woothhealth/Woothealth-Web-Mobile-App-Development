'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Provider = {
  $id: string;
  hasLogin?: boolean;
  status?: string;
};

interface ProviderStats {
  suspended: number;
  total: number;
  active: number;
  inactive: number;
}

interface ProviderStatsContextType {
  stats: ProviderStats | null;
  loading: boolean;
  error: string | null;
}

const ProvidersStatsContext = createContext<ProviderStatsContextType | undefined>(undefined);

const parseProviders = (docs: any[]): Provider[] =>
  docs.map((doc) => ({
    $id: doc.$id || doc.id || Math.random().toString(),
    hasLogin: doc.hasLogin,
    status: doc.status || (doc.hasLogin ? 'Active' : 'Inactive'),
  }));

export const ProvidersStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<ProviderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/providers?page=1&limit=1000', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch providers');
        const data = await res.json();

        let providers: any[] = [];
        if (Array.isArray(data)) {
          providers = data;
        } else if (data?.data && Array.isArray(data.data)) {
          providers = data.data;
        } else if (data?.providers && Array.isArray(data.providers)) {
          providers = data.providers;
        } else if (data?.data?.categories && Array.isArray(data.data.categories)) {
          const category = data.data.categories.find((c: any) => c.name === 'providers');
          providers = category?.documents || [];
        } else {
          console.warn('Unexpected providers response structure:', data);
          providers = [];
        }

        const normalized = parseProviders(providers);
        const activeCount = normalized.filter((provider) => provider.status === 'Active').length;
        const inactiveCount = normalized.filter((provider) => provider.status === 'Inactive').length;
        const suspendedCount = normalized.filter((provider) => provider.status === 'Suspended').length;

        setStats({ total: normalized.length, active: activeCount, inactive: inactiveCount, suspended: suspendedCount });
      } catch (err) {
        console.error(err);
        setError('Failed to load provider stats');
        setStats({ total: 0, active: 0, inactive: 0, suspended: 0 });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <ProvidersStatsContext.Provider value={{ stats, loading, error }}>
      {children}
    </ProvidersStatsContext.Provider>
  );
};

export const useProvidersStats = () => {
  const context = useContext(ProvidersStatsContext);
  if (!context) throw new Error('useProvidersStats must be used within ProvidersStatsProvider');
  return context;
};
