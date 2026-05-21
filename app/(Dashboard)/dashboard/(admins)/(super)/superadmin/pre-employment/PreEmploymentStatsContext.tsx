'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PreEmploymentTest } from './mockPreEmployment';

interface PreEmploymentStats {
  total: number;
  scheduled: number;
  approved: number;
  pending: number;
  completed: number;
  overdue: number;
}

interface PreEmploymentStatsContextType {
  stats: PreEmploymentStats;
  loading: boolean;
  error: string | null;
}

const PreEmploymentStatsContext = createContext<PreEmploymentStatsContextType | undefined>(undefined);

const normalizePreEmployment = (item: any): PreEmploymentTest => ({
  id: item.id || item.$id || item.preEmploymentId || item._id || '',
  dateOfService: item.dateOfService || item.date_of_service || item.submittedDate || '',
  scheduledDate: item.scheduledDate || item.scheduled_date || item.scheduledAt || '',
  employeeName: item.employeeName || item.name || item.fullName || '',
  employeeEmail: item.employeeEmail || item.email || '',
  employeePhone: item.employeePhone || item.phone || '',
  employeeDOB: item.employeeDOB || item.dob || '',
  company: item.company || item.employer || '',
  insurancePlan: item.insurancePlan || item.plan || '',
  provider: item.provider || item.hospitalProvider || '',
  testTypes: Array.isArray(item.testTypes) ? item.testTypes : item.testTypes ? [item.testTypes] : [],
  status: (item.status || 'scheduled').toLowerCase() as any,
  createdAt: item.createdAt || item.$createdAt || '',
});

const extractPreEmployment = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.data && Array.isArray(data.data.preEmploymentTests)) return data.data.preEmploymentTests;
  if (data.data && Array.isArray(data.data.pre_employment_tests)) return data.data.pre_employment_tests;
  return [];
};

export const PreEmploymentStatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<PreEmploymentTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/pre-employment-tests?page=1&limit=1000', {
          cache: 'no-store',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch pre-employment tests');
        const data = await res.json();
        const list = extractPreEmployment(data).map(normalizePreEmployment);
        setItems(list);
      } catch (err) {
        console.error('Error loading pre-employment stats:', err);
        setError('Unable to load pre-employment stats.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(
    () => ({
      total: items.length,
      scheduled: items.filter((it) => (it.status || '').toLowerCase() === 'scheduled').length,
      approved: items.filter((it) => (it.status || '').toLowerCase() === 'approved').length,
      pending: items.filter((it) => (it.status || '').toLowerCase() === 'pending').length,
      completed: items.filter((it) => (it.status || '').toLowerCase() === 'completed').length,
      overdue: items.filter((it) => {
        if (!it.scheduledDate) return false;
        try {
          const scheduled = new Date(it.scheduledDate);
          return scheduled < new Date() && (it.status || '').toLowerCase() !== 'completed' && (it.status || '').toLowerCase() !== 'approved';
        } catch {
          return false;
        }
      }).length,
    }),
    [items]
  );

  return (
    <PreEmploymentStatsContext.Provider value={{ stats, loading, error }}>
      {children}
    </PreEmploymentStatsContext.Provider>
  );
};

export const usePreEmploymentStats = () => {
  const context = useContext(PreEmploymentStatsContext);
  if (context === undefined) throw new Error('usePreEmploymentStats must be used within a PreEmploymentStatsProvider');
  return context;
};
