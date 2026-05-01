'use client';

import { mockRoles } from '../../mockRoles';

export default function TotalPlansCard() {
  // For now, we'll show total roles as plans
  const total = mockRoles.length;

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#49A5EF1A] border border-[#49A5EF] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Total Plans</p>
      <h3 className="text-3xl font-bold text-[#49A5EF]">{total.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">All roles</p>
    </div>
  );
}