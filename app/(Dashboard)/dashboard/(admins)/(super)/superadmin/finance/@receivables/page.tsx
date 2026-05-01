'use client';

import { useFinanceStats } from '../FinanceStatsContext';

export default function ReceivablesCard() {
  const { stats, loading } = useFinanceStats();

  return (
    <div className="w-44 md:w-full py-6 px-4 rounded-[10px] bg-[#FFDE001A] shadow-sm border border-[#FFDE00]">
      <p className="text-base font-medium mb-2">Receivables</p>
      <h3 className="text-3xl font-bold text-[#FFDE00]">
        {loading ? '...' : `₦${(stats?.receivables || 0).toLocaleString()}`}
      </h3>
      <p className='text-xs'>Installment Pending</p>
    </div>
  );
}
