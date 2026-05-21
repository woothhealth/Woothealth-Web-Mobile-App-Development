'use client';

import { usePreEmploymentStats } from '../../PreEmploymentStatsContext';

export default function PendingTestCard() {
  const { stats, loading } = usePreEmploymentStats();
  const count = loading ? '-' : stats.pending.toLocaleString();

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#FFDE001A] border border-[#FFDE00] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Pending</p>
      <h3 className="text-3xl font-bold text-[#FFDE00]">{count}</h3>
      <p className="text-xs text-slate-500">Awaiting test</p>
    </div>
  );
}
