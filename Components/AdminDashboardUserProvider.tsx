"use client";

import React, { createContext, useContext, useState } from "react";

type AdminUser = {
  id?: string | null;
  role?: string | null;
  name?: string | null;
  email?: string | null;
} | null;

const AdminDashboardUserContext = createContext<AdminUser>(null);

export function AdminDashboardUserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AdminUser;
}) {
  const [user] = useState<AdminUser>(initialUser);

  return (
    <AdminDashboardUserContext.Provider value={user}>
      {children}
    </AdminDashboardUserContext.Provider>
  );
}

export function useAdminDashboardUser() {
  const ctx = useContext(AdminDashboardUserContext);
  return ctx;
}

export default AdminDashboardUserProvider;