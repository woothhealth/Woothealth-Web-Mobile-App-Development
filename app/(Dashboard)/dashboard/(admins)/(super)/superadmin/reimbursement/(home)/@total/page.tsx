'use client';

import { useReimbursementStats } from '../ReimbursementStatsContext';

export default function TotalReimbursementCard() {
  const { stats, loading } = useReimbursementStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#49A5EF1A] shadow-sm border border-[#49A5EF]">
      <p className="text-base font-medium mb-2">Total Reimbursement</p>
      <h3 className="text-3xl font-bold text-[#49A5EF]">
        {loading ? '...' : stats.total}
      </h3>
      <p className="text-xs text-slate-600">All Time</p>
    </div>
  );
}
