'use client';

import { mockRoles } from '../../mockRoles';

export default function SuperadminCard() {
  const superadminRole = mockRoles.find(role => role.name === 'Super Admin');
  const count = superadminRole ? superadminRole.totalUsers : 0;

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#10B9811A] border border-[#10B981] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Superadmin</p>
      <h3 className="text-3xl font-bold text-[#10B981]">{count.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">Users</p>
    </div>
  );
}