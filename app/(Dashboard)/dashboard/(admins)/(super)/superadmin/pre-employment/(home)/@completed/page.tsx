'use client';

import { mockPreEmployment } from '../../mockPreEmployment';

export default function CompletedTestCard() {
  const completedCount = mockPreEmployment.filter((test) => test.status === 'completed').length;

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#10B9811A] border border-[#10B981] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Completed</p>
      <h3 className="text-3xl font-bold text-[#10B981]">{completedCount.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">Tested</p>
    </div>
  );
}
