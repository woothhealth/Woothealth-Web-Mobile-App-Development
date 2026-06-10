'use client';

import { useEffect, useState } from 'react';
import { fetchRoles } from '../../rolesService';

export default function CustomRolesCard() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchRoles({ limit: 200 })
      .then((roles) => {
        if (!mounted) return;
        const custom = roles.filter((r: any) => r.name !== 'Super Admin' && r.name !== 'Superadmin');
        setCount(custom.length);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false };
  }, []);

  return (
    <div className="w-44 md:w-full rounded-[10px] bg-[#F59E0B1A] border border-[#F59E0B] px-4 py-6 shadow-sm">
      <p className="text-base font-medium mb-2">Custom Roles</p>
      <h3 className="text-3xl font-bold text-[#F59E0B]">{loading ? '—' : count.toLocaleString()}</h3>
      <p className="text-xs md:text-sm mt-1 text-slate-500">Defined roles</p>
    </div>
  );
}