'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAdminEnrollees as useAdminEnrolleesQuery } from '@/lib/api';

interface AdminEnrollee {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  enrollmentDate?: string;
  [key: string]: any;
}

interface AdminEnrolleesData {
  success: boolean;
  data: AdminEnrollee[];
  total: number;
  message?: string;
}

interface AdminEnrolleesContextType {
  enrollees: AdminEnrolleesData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const AdminEnrolleesContext = createContext<AdminEnrolleesContextType | undefined>(undefined);

export const AdminEnrolleesProvider: React.FC<{ children: ReactNode; search?: string; page?: number }> = ({ children, search = '', page = 1 }) => {
  const { data: enrollees, isLoading: loading, error, refetch } = useAdminEnrolleesQuery(search, page);
  const errorMessage = error ? String(error) : null;

  return (
    <AdminEnrolleesContext.Provider value={{ enrollees: enrollees || null, loading, error: errorMessage, refetch }}>
      {children}
    </AdminEnrolleesContext.Provider>
  );
};

export const useAdminEnrollees = () => {
  const context = useContext(AdminEnrolleesContext);
  if (context === undefined) {
    throw new Error('useAdminEnrollees must be used within an AdminEnrolleesProvider');
  }
  return context;
};