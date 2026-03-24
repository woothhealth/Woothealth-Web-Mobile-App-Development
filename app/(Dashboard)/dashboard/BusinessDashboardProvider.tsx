import React from 'react';
import { getCurrentUser } from '@/lib/currentUser';
import BusinessDashboardUserProvider from '@/Components/BusinessDashboardUserProvider';
import { NotificationProvider } from '@/context/NotificationContext';
import { WalletProvider } from '@/Components/WalletContext';
import { TransactionRefreshProvider } from '@/Components/TransactionRefreshContext';
import { cookies } from 'next/headers';

export default async function BusinessDashboardProvider({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Fetch business profile data
  let businessProfile = {
    id: user?.id || null,
    role: user?.role || 'business',
    name: user?.name || null,
    email: user?.email || null,
    industry: user?.industry || 'Healthcare',
    companyAddress: user?.companyAddress || '',
    regNumber: '',
    phone: '',
    company: user?.company || '',
    plan: user?.plan || 'No Plan found',
    status: 'Active',
  };

  try {
    // Build cookie header for server-side fetch
    const cookieStore = await cookies();
    const cookieHeader = (cookieStore.getAll?.() || [])
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/business/profile`, {
      cache: 'no-store',
      headers: {
        cookie: cookieHeader,
      },
    });

    if (res.ok) {
      const data = await res.json();
      businessProfile = {
        ...businessProfile,
        industry: data.industry || businessProfile.industry,
        companyAddress: data.companyAddress || businessProfile.companyAddress,
        regNumber: data.regNumber || businessProfile.regNumber,
        phone: data.phone || businessProfile.phone,
        status: data.status || businessProfile.status,
      };
    }
  } catch (error) {
    console.error('Failed to fetch business profile:', error);
  }

  return (
    <NotificationProvider>
      <BusinessDashboardUserProvider initialUser={businessProfile}>
        <WalletProvider>
          <TransactionRefreshProvider>
            {children}
          </TransactionRefreshProvider>
        </WalletProvider>
      </BusinessDashboardUserProvider>
    </NotificationProvider>
  );
}