'use client';

import { usePreEmploymentStats } from '../../PreEmploymentStatsContext';

export default function TotalTestCard() {
  const { stats, loading } = usePreEmploymentStats();
  const total = loading ? '-' : stats.total.toLocaleString();

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#49A5EF1A] border border-[#49A5EF] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Total Tests</p>
      <h3 className="text-3xl font-bold text-[#49A5EF]">{total}</h3>
      <p className="text-xs text-slate-500">All time</p>
    </div>
  );
}
