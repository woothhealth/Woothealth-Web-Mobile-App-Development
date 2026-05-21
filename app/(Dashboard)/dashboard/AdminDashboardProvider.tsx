import React from 'react';
import { cookies } from 'next/headers';
import AdminDashboardUserProvider from '@/Components/AdminDashboardUserProvider';
import { NotificationProvider } from '@/context/NotificationContext';
import { getCurrentUser } from '@/lib/currentUser';

export default async function AdminDashboardProvider({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  const getProfileRole = (profile: any) => {
    if (!profile) return null;
    if (Array.isArray(profile)) return profile[0] || null;
    return String(profile);
  };

  // Fetch admin profile data. Use auth role for session auth and profile role for RBAC.
  let adminProfile = {
    id: user?.id || null,
    role: user?.role || null,
    authRole: user?.role || null,
    name: user?.name || null,
    email: user?.email || null,
  };

  try {
    // Build cookie header for server-side fetch
    const cookieStore = await cookies();
    const cookieHeader = (cookieStore.getAll?.() || [])
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/profile`, {
      cache: 'no-store',
      headers: {
        cookie: cookieHeader,
      },
    });

    if (res.ok) {
      const data = await res.json();
      const profileRole = getProfileRole(data.role || data.roles);

      adminProfile = {
        ...adminProfile,
        role: profileRole || adminProfile.role,
        name: data.name || adminProfile.name,
        email: data.email || adminProfile.email,
      };
    }
  } catch (error) {
    console.error('Failed to fetch admin profile:', error);
  }

  return (
    <NotificationProvider>
      <AdminDashboardUserProvider initialUser={adminProfile}>
        {children}
      </AdminDashboardUserProvider>
    </NotificationProvider>
  );
}