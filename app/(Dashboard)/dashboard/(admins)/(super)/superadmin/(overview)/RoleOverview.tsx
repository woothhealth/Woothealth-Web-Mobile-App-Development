'use client'

import React from 'react';
import { normalizeRole } from '@/lib/permissions';
import AdminOverview from './roleViews/AdminOverview';
import SuperadminOverview from './roleViews/SuperadminOverview';
import SalesOverview from './roleViews/SalesOverview';
import FinanceOverview from './roleViews/FinanceOverview';
import SupportOverview from './roleViews/SupportOverview';
import ClaimsOverview from './roleViews/ClaimsOverview';
import ProviderOpsOverview from './roleViews/ProviderOpsOverview';
import UnderwritingOverview from './roleViews/UnderwritingOverview';
import HrOverview from './roleViews/HrOverview';
import DefaultOverview from './roleViews/DefaultOverview';

type RoleOverviewProps = {
  role: string | null;
};

const RoleOverview: React.FC<RoleOverviewProps> = ({ role }) => {
  const normalizedRole = normalizeRole(role) ?? 'superadmin';
  const roleComponentMap: Record<string, React.ComponentType> = {
    superadmin: SuperadminOverview,
    admin: AdminOverview,
    support: SupportOverview,
    sales: SalesOverview,
    finance: FinanceOverview,
    claims: ClaimsOverview,
    'provider ops': ProviderOpsOverview,
    underwriting: UnderwritingOverview,
    hr: HrOverview,
  };

  const SelectedOverview = roleComponentMap[normalizedRole] ?? DefaultOverview;
  return <SelectedOverview />;
};

export default RoleOverview;
