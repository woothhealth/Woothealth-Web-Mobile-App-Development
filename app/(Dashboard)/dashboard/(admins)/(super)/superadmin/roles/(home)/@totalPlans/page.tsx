'use client';

import { useEffect, useState } from 'react';
import { fetchRoles } from '../../rolesService';

export default function TotalPlansCard() {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchRoles({ limit: 100 })
      .then((roles) => {
        if (!mounted) return;
        setTotal(roles.length);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#49A5EF1A] border border-[#49A5EF] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Total Plans</p>
      <h3 className="text-3xl font-bold text-[#49A5EF]">{loading ? '—' : total.toLocaleString()}</h3>
      <p className="text-xs text-slate-500">All roles</p>
    </div>
  );
}