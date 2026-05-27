'use client';

import { useEffect, useState } from 'react';
import { fetchRoles, computeRoleStats } from '../../rolesService';

export default function TotalUsersCard() {
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchRoles({ limit: 100 })
      .then((roles) => {
        if (!mounted) return;
        const stats = computeRoleStats(roles);
        setTotalUsers(stats.totalUsers);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#EF44441A] border border-[#EF4444] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Total Users</p>
      <h3 className="text-3xl font-bold text-[#EF4444]">{loading ? '—' : totalUsers.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">All users</p>
    </div>
  );
}