'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Reimbursement } from './(home)/mockReimbursements';

interface ReimbursementStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ReimbursementStatsContextType {
  stats: ReimbursementStats;
  loading: boolean;
  error: string | null;
}

const ReimbursementStatsContext = createContext<ReimbursementStatsContextType | undefined>(undefined);

const normalizeReimbursement = (item: any): Reimbursement => ({
  id: item.id || item.$id || item.reimbursementId || item._id || '',
  reimbursementId: item.reimbursementId || item.reimbursement_id || item.id || item.$id || '',
  dateOfService: item.dateOfService || item.date_of_service || item.submittedDate || '',
  submittedDate: item.submittedDate || item.submitted_date || item.createdAt || '',
  patient: item.patient || item.patientName || item.fullName || '',
  hmoId: item.hmoId || item.hmo_id || item.userId || '',
  provider: item.provider || item.hospitalProvider || '',
  service: item.service || item.treatment || '',
  amount: typeof item.amount === 'string' ? Number(item.amount) : item.amount || 0,
  status: (item.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'rejected',
  documentCount: item.documentCount ?? item.documents?.length ?? 0,
  approvedAmount: item.approvedAmount ?? item.approved_amount ?? undefined,
  paCode: item.paCode ?? item.pa_code ?? undefined,
  comment: item.comment ?? item.notes ?? item.reviewNotes ?? undefined,
});

const extractReimbursements = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.data && data.data.reimbursements && Array.isArray(data.data.reimbursements)) return data.data.reimbursements;
  return [];
};

export const ReimbursementStatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/admin/reimbursement', {
          cache: 'no-store',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reimbursement stats');
        }

        const data = await response.json();
        const list = extractReimbursements(data).map(normalizeReimbursement);
        setReimbursements(list);
      } catch (fetchError) {
        console.error('Error loading reimbursement stats:', fetchError);
        setError('Unable to load reimbursement stats.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const stats = useMemo(
    () => ({
      total: reimbursements.length,
      pending: reimbursements.filter((item) => item.status === 'pending').length,
      approved: reimbursements.filter((item) => item.status === 'approved').length,
      rejected: reimbursements.filter((item) => item.status === 'rejected').length,
    }),
    [reimbursements]
  );

  return (
    <ReimbursementStatsContext.Provider value={{ stats, loading, error }}>
      {children}
    </ReimbursementStatsContext.Provider>
  );
};

export const useReimbursementStats = () => {
  const context = useContext(ReimbursementStatsContext);
  if (context === undefined) {
    throw new Error('useReimbursementStats must be used within a ReimbursementStatsProvider');
  }
  return context;
};
