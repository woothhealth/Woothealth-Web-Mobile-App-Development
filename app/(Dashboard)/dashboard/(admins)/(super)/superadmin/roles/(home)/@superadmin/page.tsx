'use client';

import { useEffect, useState } from 'react';
import { getAdminUsersCount } from '@/lib/adminUser';
import { useAdminOverview } from '@/Components/AdminOverviewContext';

export default function SuperadminCard() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const { overview } = useAdminOverview();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminUsersCount()
      .then((c) => {
        if (!mounted) return;
        setCount(c || 0);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#10B9811A] border border-[#10B981] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Administrators</p>
      <h3 className="text-3xl font-bold text-[#10B981]">{loading ? '—' : count.toLocaleString()}</h3>
      <p className="text-xs md:text-sm mt-1 text-slate-500">Users</p>
    </div>
  );
}