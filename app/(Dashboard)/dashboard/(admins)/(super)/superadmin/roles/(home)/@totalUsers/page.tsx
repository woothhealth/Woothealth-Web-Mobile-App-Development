'use client';

import { mockRoles } from '../../mockRoles';

export default function TotalUsersCard() {
  const totalUsers = mockRoles.reduce((sum, role) => sum + role.totalUsers, 0);

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#EF44441A] border border-[#EF4444] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Total Users</p>
      <h3 className="text-3xl font-bold text-[#EF4444]">{totalUsers.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">All users</p>
    </div>
  );
}