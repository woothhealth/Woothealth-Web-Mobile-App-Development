'use client';

import { useFinanceStats } from '../FinanceStatsContext';

export default function MoneyGeneratedCard() {
  const { stats, loading } = useFinanceStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#D1FAE5] shadow-sm border border-[#10B981]">
      <p className="text-base font-medium mb-2">Money Generated</p>
      <h3 className="text-3xl font-bold text-[#10B981]">
        {loading ? '...' : `₦${(stats?.moneyGenerated || 0).toLocaleString()}`}
      </h3>
      <p className='text-xs'>This Month</p>
    </div>
  );
}
