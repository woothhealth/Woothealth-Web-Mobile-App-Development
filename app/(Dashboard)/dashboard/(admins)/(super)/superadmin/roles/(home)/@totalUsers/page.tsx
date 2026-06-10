'use client';

import { useEffect, useState } from 'react';
import { fetchRoles, computeRoleStats } from '../../rolesService';
import { useAdminOverview } from '@/Components/AdminOverviewContext';

export default function TotalUsersCard() {
  const { overview, loading } = useAdminOverview();

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#EF44441A] border border-[#EF4444] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Total Users</p>
      <h3 className="text-3xl font-bold text-[#EF4444]">{loading ? '—' : overview?.totalUsers?.toLocaleString()}</h3>
      <p className="text-xs md:text-sm mt-1 text-slate-500">All users</p>
    </div>
  );
}