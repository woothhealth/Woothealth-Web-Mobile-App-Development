'use client';

import { useEffect, useState } from 'react';
import { fetchRoles } from '../../rolesService';

export default function SuperadminCard() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchRoles({ limit: 200 })
      .then((roles) => {
        if (!mounted) return;
        const r = roles.find((role: any) => role.name === 'Super Admin' || role.name === 'Superadmin');
        setCount(r ? (r.totalUsers ?? (r.users ? r.users.length : 0)) : 0);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#10B9811A] border border-[#10B981] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Superadmin</p>
      <h3 className="text-3xl font-bold text-[#10B981]">{loading ? '—' : count.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">Users</p>
    </div>
  );
}