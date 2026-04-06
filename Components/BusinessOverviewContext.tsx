import React, { createContext, useContext, ReactNode } from 'react';
import { useBusinessOverview as useBusinessOverviewQuery, useBusinessEmployees } from '@/lib/api';

interface EmployeeStats {
  success: boolean;
  stats: {
    totalEnrollees: number;
    active: number;
    slotsAvailable: number;
  };
  data: any[];
  total: number;
}

interface OverviewData {
  totalEmployees?: number;
  activeReimbursements?: number;
  walletBalance?: number;
  employeeStats?: {
    total: number;
    active: number;
    enrolled: number;
    slotsAvailable: number;
  };
  annualCoverage?: {
    totalLimit: number;
    usedThisYear: number;
    remainingBalance: number;
    utilizationRate: number;
  };
  planBreakdown?: any[];
  recentActivities?: any[];
  plans?: any[];
  daysToExpiry?: number | null;
}

interface BusinessOverviewContextType {
  overview: OverviewData | null;
  employees: EmployeeStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const BusinessOverviewContext = createContext<BusinessOverviewContextType | undefined>(undefined);

export const BusinessOverviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: overview, isLoading: overviewLoading, error: overviewError, refetch: refetchOverview } = useBusinessOverviewQuery();
  const { data: employees, isLoading: employeesLoading, error: employeesError, refetch: refetchEmployees } = useBusinessEmployees();

  const loading = overviewLoading || employeesLoading;
  const error = overviewError?.message || employeesError?.message || null;

  const refetch = () => {
    refetchOverview();
    refetchEmployees();
  };

  return (
    <BusinessOverviewContext.Provider value={{ overview: overview || null, employees: employees || null, loading, error, refetch }}>
      {children}
    </BusinessOverviewContext.Provider>
  );
};

export const useBusinessOverview = () => {
  const context = useContext(BusinessOverviewContext);
  if (context === undefined) {
    throw new Error('useBusinessOverview must be used within a BusinessOverviewProvider');
  }
  return context;
};