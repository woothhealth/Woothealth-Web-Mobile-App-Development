'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminOverview as useAdminOverviewQuery } from '@/lib/api';

interface AdminOverviewData {
  totalUsers: number;
  totalEnrollees: number;
  activeClients: number;
  telemedicineRequests: number;
}

interface AdminOverviewContextType {
  overview: AdminOverviewData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const AdminOverviewContext = createContext<AdminOverviewContextType | undefined>(undefined);

export const AdminOverviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: overview, isLoading: loading, error, refetch } = useAdminOverviewQuery();
  const errorMessage = error ? String(error) : null;

  return (
    <AdminOverviewContext.Provider value={{ overview: overview || null, loading, error: errorMessage, refetch }}>
      {children}
    </AdminOverviewContext.Provider>
  );
};

export const useAdminOverview = () => {
  const context = useContext(AdminOverviewContext);
  if (context === undefined) {
    throw new Error('useAdminOverview must be used within an AdminOverviewProvider');
  }
  return context;
};