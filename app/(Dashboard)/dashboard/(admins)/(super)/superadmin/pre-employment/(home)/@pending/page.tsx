'use client';

import { mockPreEmployment } from '../../mockPreEmployment';

export default function PendingTestCard() {
  const pendingCount = mockPreEmployment.filter((test) => test.status === 'pending').length;

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#FFDE001A] border border-[#FFDE00] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Pending</p>
      <h3 className="text-3xl font-bold text-[#FFDE00]">{pendingCount.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">Awaiting test</p>
    </div>
  );
}
