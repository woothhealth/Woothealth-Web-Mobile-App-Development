'use client';

import { mockRoles } from '../../mockRoles';

export default function CustomRolesCard() {
  const customRoles = mockRoles.filter(role => role.name !== 'Super Admin');
  const count = customRoles.length;

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#F59E0B1A] border border-[#F59E0B] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Custom Roles</p>
      <h3 className="text-3xl font-bold text-[#F59E0B]">{count.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">Defined roles</p>
    </div>
  );
}