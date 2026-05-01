'use client';

import { useFinanceStats } from '../FinanceStatsContext';

export default function RefundRequestCard() {
  const { stats, loading } = useFinanceStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#EF44441A] shadow-sm border border-[#EF4444]">
      <p className="text-base font-medium mb-2">Refund Requests</p>
      <h3 className="text-3xl font-bold text-[#EF4444]">
        {loading ? '...' : stats?.refundRequest || 0}
      </h3>
      <p className='text-xs'>Awaiting Review</p>
    </div>
  );
}
