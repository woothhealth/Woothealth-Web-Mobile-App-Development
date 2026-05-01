'use client';

import { useValidationsStats } from '../ValidationsStatsContext';

export default function ApprovedValidationsCard() {
  const { stats, loading } = useValidationsStats();

  return (
    <div className="w-50 md:w-full py-6 px-4 rounded-[10px] bg-[#10B9811A] shadow-sm border border-[#10B981]">
      <p className="md:text-xl text-lg font-medium mb-2">Approved Validations</p>
      <h3 className="text-3xl font-bold text-[#10B981]">
        {loading ? '...' : stats?.approved ?? 0}
      </h3>
      <p className='text-sm'>Successfully validated</p>
    </div>
  );
}