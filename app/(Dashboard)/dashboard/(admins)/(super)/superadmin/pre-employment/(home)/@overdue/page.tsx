'use client';

import { usePreEmploymentStats } from '../../PreEmploymentStatsContext';

export default function OverdueTestCard() {
  const { stats, loading } = usePreEmploymentStats();
  const count = loading ? '-' : stats.overdue.toLocaleString();

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#EF44441A] border border-[#EF4444] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Overdue</p>
      <h3 className="text-3xl font-bold text-[#EF4444]">{count}</h3>
      <p className="text-xs text-slate-500">Delayed</p>
    </div>
  );
}
