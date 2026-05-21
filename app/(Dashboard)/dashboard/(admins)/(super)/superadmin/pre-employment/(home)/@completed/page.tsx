'use client';

import { usePreEmploymentStats } from '../../PreEmploymentStatsContext';

export default function CompletedTestCard() {
  const { stats, loading } = usePreEmploymentStats();
  const count = loading ? '-' : stats.completed.toLocaleString();

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#10B9811A] border border-[#10B981] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Completed</p>
      <h3 className="text-3xl font-bold text-[#10B981]">{count}</h3>
      <p className="text-xs text-slate-500">Tested</p>
    </div>
  );
}
