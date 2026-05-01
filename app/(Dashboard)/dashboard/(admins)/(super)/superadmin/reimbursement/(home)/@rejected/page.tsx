'use client';

import { useReimbursementStats } from '../ReimbursementStatsContext';

export default function RejectedReimbursementCard() {
  const { stats, loading } = useReimbursementStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#EF44441A] shadow-sm border border-[#EF4444]">
      <p className="text-base font-medium mb-2">Rejected</p>
      <h3 className="text-3xl font-bold text-[#EF4444]">
        {loading ? '...' : stats.rejected}
      </h3>
      <p className="text-xs">Claims denied</p>
    </div>
  );
}
