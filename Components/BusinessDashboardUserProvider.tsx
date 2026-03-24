"use client";

import React, { createContext, useContext, useState } from "react";

type BusinessUser = {
  id?: string | null;
  role?: string | null;
  name?: string | null;
  email?: string | null;
  industry?: string | null;
  companyAddress?: string | null;
  company?: string | null;
  regNumber?: string | null;
  phone?: string | null;
  plan?: string | null;
  status?: string | null;
} | null;

const BusinessDashboardUserContext = createContext<BusinessUser>(null);

export function BusinessDashboardUserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: BusinessUser;
}) {
  const [user] = useState<BusinessUser>(initialUser);

  return (
    <BusinessDashboardUserContext.Provider value={user}>
      {children}
    </BusinessDashboardUserContext.Provider>
  );
}

export function useBusinessDashboardUser() {
  const ctx = useContext(BusinessDashboardUserContext);
  return ctx;
}

export default BusinessDashboardUserProvider;