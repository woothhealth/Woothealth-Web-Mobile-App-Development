'use client';

import { useProvidersStats } from '../ProvidersStatsContext';

export default function ActiveProvidersCard() {
  const { stats, loading } = useProvidersStats();

  return (
    <div className="w-50 md:w-full py-6 px-4 rounded-[10px] bg-[#10B9811A] shadow-sm border border-[#10B981]">
      <p className="md:text-xl text-lg font-medium mb-2">Active Providers</p>
      <h3 className="text-3xl font-bold text-[#10B981]">
        {loading ? '...' : stats?.active ?? 0}
      </h3>
      <p className='text-sm'>Currently operational</p>
    </div>
  );
}
