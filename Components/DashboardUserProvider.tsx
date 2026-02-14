"use client";

import React, { createContext, useContext, useState } from "react";

type User = {
  id?: string | null;
  role?: string | null;
  name?: string | null;
  email?: string | null;
} | null;

const DashboardUserContext = createContext<User>(null);

export function DashboardUserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User;
}) {
  const [user] = useState<User>(initialUser);

  return (
    <DashboardUserContext.Provider value={user}>
      {children}
    </DashboardUserContext.Provider>
  );
}

export function useDashboardUser() {
  const ctx = useContext(DashboardUserContext);
  return ctx;
}

export default DashboardUserProvider;
