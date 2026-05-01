'use client';

import { useFinanceStats } from '../FinanceStatsContext';

export default function TotalRevenueCard() {
  const { stats, loading } = useFinanceStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#49A5EF1A] shadow-sm border border-[#49A5EF]">
      <p className="text-base font-medium mb-2">Total Revenue</p>
      <h3 className="text-3xl font-bold text-[#49A5EF]">
        {loading ? '...' : `₦${(stats?.totalRevenue || 0).toLocaleString()}`}
      </h3>
      <p className='text-xs'>78% of EOY Target</p>
    </div>
  );
}
