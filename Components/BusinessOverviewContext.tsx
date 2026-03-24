import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  refreshData: () => Promise<void>;
}

const BusinessOverviewContext = createContext<BusinessOverviewContextType | undefined>(undefined);

export const BusinessOverviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [employees, setEmployees] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both endpoints in parallel
      const [overviewRes, employeesRes] = await Promise.all([
        fetch('/api/business/overview'),
        fetch('/api/business/employees')
      ]);

      const overviewData = await overviewRes.json();
      const employeesData = await employeesRes.json();

      setOverview(overviewData);
      setEmployees(employeesData);
    } catch (err) {
      console.error('Failed to fetch business data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <BusinessOverviewContext.Provider value={{ overview, employees, loading, error, refreshData: fetchData }}>
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