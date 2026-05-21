'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Telemedicine = {
  $id: string;
  status: string;
};

interface TelemedicineStats {
  accepted: number;
  declined: number;
}

interface TelemedicineStatsContextType {
  stats: TelemedicineStats | null;
  loading: boolean;
  error: string | null;
}

const TelemedicineStatsContext = createContext<TelemedicineStatsContextType | undefined>(undefined);

const normalizeTelemedicineItem = (doc: any): Telemedicine => ({
  $id: doc.$id || doc.id || doc.telemedicineId || Math.random().toString(),
  status: (doc.status || doc.requestStatus || 'pending').toString().toLowerCase(),
});

const extractTelemedicine = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.data?.telemedicine)) return data.data.telemedicine;
  return [];
};

export const TelemedicineStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<TelemedicineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/telemedicine?page=1&limit=1000', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch telemedicine');
        const data = await res.json();

        const telemedicine = extractTelemedicine(data);
        const normalized = telemedicine.map(normalizeTelemedicineItem);
        const acceptedCount = normalized.filter((item) => item.status === 'accepted' || item.status === 'completed' || item.status === 'ongoing').length;
        const declinedCount = normalized.filter((item) => item.status === 'declined').length;

        setStats({ accepted: acceptedCount, declined: declinedCount });
      } catch (err) {
        console.error(err);
        setError('Failed to load telemedicine stats');
        setStats({ accepted: 0, declined: 0 });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <TelemedicineStatsContext.Provider value={{ stats, loading, error }}>
      {children}
    </TelemedicineStatsContext.Provider>
  );
};

export const useTelemedicineStats = () => {
  const context = useContext(TelemedicineStatsContext);
  if (!context) throw new Error('useTelemedicineStats must be used within TelemedicineStatsProvider');
  return context;
};