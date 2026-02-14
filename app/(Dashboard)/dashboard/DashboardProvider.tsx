import React from 'react';
import { getCurrentUser } from '@/lib/currentUser';
import DashboardUserProvider from '@/Components/DashboardUserProvider';
import { NotificationProvider } from '@/context/NotificationContext';

export default async function DashboardProvider({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <NotificationProvider>
      <DashboardUserProvider initialUser={user}>{children}</DashboardUserProvider>
    </NotificationProvider>
  );
}
