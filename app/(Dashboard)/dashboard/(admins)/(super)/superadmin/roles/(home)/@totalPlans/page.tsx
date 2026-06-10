'use client';

import { useEffect, useState } from 'react';
import { fetchRoles } from '../../rolesService';
import { useBenefitsStatsContext } from '../../../benefits/BenefitsStatsContext';

export default function TotalPlansCard() {
  const { stats, loading } = useBenefitsStatsContext();
  const totalCount = stats?.total || 0;

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#49A5EF1A] border border-[#49A5EF] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Total Plans</p>
      <h3 className="text-3xl font-bold text-[#49A5EF]">{loading ? '—' : totalCount.toLocaleString()}</h3>
      <p className="text-xs md:text-sm mt-1 text-slate-500">All roles</p>
    </div>
  );
}