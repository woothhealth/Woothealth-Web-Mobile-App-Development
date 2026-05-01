'use client';

import { useLeadsStats } from '../LeadsStatsContext';

export default function NewLeadsCard() {
  const { stats } = useLeadsStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#49A5EF1A] shadow-sm border border-[#49A5EF]">
      <p className="text-base font-medium mb-2">New Leads</p>
      <h3 className="text-3xl font-bold text-[#49A5EF]">{stats.newLead}</h3>
      <p className="text-xs">Not contacted yet</p>
    </div>
  );
}
