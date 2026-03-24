'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type TransactionRefreshContextType = {
  refreshTrigger: number;
  triggerRefresh: () => void;
};

const TransactionRefreshContext = createContext<TransactionRefreshContextType | null>(null);

export function TransactionRefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <TransactionRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </TransactionRefreshContext.Provider>
  );
}

export function useTransactionRefresh() {
  const context = useContext(TransactionRefreshContext);
  if (!context) {
    throw new Error('useTransactionRefresh must be used within TransactionRefreshProvider');
  }
  return context;
}
