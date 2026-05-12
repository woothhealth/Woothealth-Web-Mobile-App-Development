'use client';

import { useReimbursementStats } from '../../ReimbursementStatsContext';

export default function ApprovedReimbursementCard() {
  const { stats, loading } = useReimbursementStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#10B9811A] shadow-sm border border-[#10B981]">
      <p className="text-base font-medium mb-2">Approved</p>
      <h3 className="text-3xl font-bold text-[#10B981]">
        {loading ? '...' : stats.approved}
      </h3>
      <p className="text-xs">Processed</p>
    </div>
  );
}
