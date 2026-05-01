'use client';

import { useLeadsStats } from '../LeadsStatsContext';

export default function LostLeadsCard() {
  const { stats } = useLeadsStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#EF44441A] shadow-sm border border-[#EF4444]">
      <p className="text-base font-medium mb-2">Lost</p>
      <h3 className="text-3xl font-bold text-[#EF4444]">{stats.lost}</h3>
      <p className="text-xs">This month</p>
    </div>
  );
}
