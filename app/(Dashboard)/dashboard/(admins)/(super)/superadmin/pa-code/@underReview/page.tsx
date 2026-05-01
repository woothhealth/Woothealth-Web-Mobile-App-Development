'use client';

import { usePaCodesStats } from '../PaCodesStatsContext';

export default function UnderReviewPaCodesCard() {
  const { stats, loading } = usePaCodesStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#F59E0B1A] shadow-sm border border-[#F59E0B]">
      <p className="md:text-xl text-lg font-medium mb-2">Under Review PA Codes</p>
      <h3 className="text-3xl font-bold text-[#F59E0B]">
        {loading ? '...' : stats?.underReview ?? 0}
      </h3>
      <p className='text-sm'>Currently under review</p>
    </div>
  );
}