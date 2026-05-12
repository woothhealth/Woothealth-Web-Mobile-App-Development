'use client';

import { useReimbursementStats } from '../../ReimbursementStatsContext';

export default function PendingReviewCard() {
  const { stats, loading } = useReimbursementStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#FFDE001A] shadow-sm border border-[#FFDE00]">
      <p className="text-base font-medium mb-2">Pending Review</p>
      <h3 className="text-3xl font-bold text-[#FFDE00]">
        {loading ? '...' : stats.pending}
      </h3>
      <p className="text-xs text-slate-600">Awaiting decision</p>
    </div>
  );
}
