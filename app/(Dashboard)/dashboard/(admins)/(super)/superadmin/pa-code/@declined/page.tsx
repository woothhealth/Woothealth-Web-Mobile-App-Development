'use client';

import { usePaCodesStats } from '../PaCodesStatsContext';

export default function DeclinedPaCodesCard() {
  const { stats, loading } = usePaCodesStats();

  return (
    <div className="w-50 md:w-full py-6 px-4 rounded-[10px] bg-[#EF44441A] shadow-sm border border-[#EF4444]">
      <p className="md:text-xl text-lg font-medium mb-2">Declined PA Codes</p>
      <h3 className="text-3xl font-bold text-[#EF4444]">
        {loading ? '...' : stats?.declined ?? 0}
      </h3>
      <p className='text-sm'>Declined requests</p>
    </div>
  );
}