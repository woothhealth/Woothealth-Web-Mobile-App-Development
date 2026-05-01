'use client';

import { useLeadsStats } from '../LeadsStatsContext';

export default function ContactedLeadsCard() {
  const { stats } = useLeadsStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#FFDE001A] shadow-sm border border-[#FFDE00]">
      <p className="text-base font-medium mb-2">Contacted</p>
      <h3 className="text-3xl font-bold text-[#FFDE00]">{stats.contacted}</h3>
      <p className="text-xs">In discussion</p>
    </div>
  );
}
