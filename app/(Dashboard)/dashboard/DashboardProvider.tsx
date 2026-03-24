import React from 'react';
import { getCurrentUser } from '@/lib/currentUser';
import DashboardUserProvider from '@/Components/DashboardUserProvider';
import { NotificationProvider } from '@/context/NotificationContext';
import { WalletProvider } from '@/Components/WalletContext';
import { TransactionRefreshProvider } from '@/Components/TransactionRefreshContext';

export default async function DashboardProvider({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <NotificationProvider>
      <DashboardUserProvider initialUser={user}>
        <WalletProvider>
          <TransactionRefreshProvider>
            {children}
          </TransactionRefreshProvider>
        </WalletProvider>
      </DashboardUserProvider>
    </NotificationProvider>
  );
}
