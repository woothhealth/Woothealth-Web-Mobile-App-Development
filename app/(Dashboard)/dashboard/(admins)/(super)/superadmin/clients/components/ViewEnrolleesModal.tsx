'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ViewEnrolleesModalProps {
  clientId: string;
  clientName: string;
  enrolleeCount: number;
  onClose: () => void;
}

export function ViewEnrolleesModal({ clientId, clientName, enrolleeCount, onClose }: ViewEnrolleesModalProps) {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/clients?clientId=${encodeURIComponent(clientId)}`, { credentials: 'include' });
        const json = await res.json().catch(() => null);
        if (!mounted) return;
        setData(json?.data || json);
        // eslint-disable-next-line no-console
        console.debug('ViewEnrolleesModal backend data:', json);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching enrollees data', err);
      }
    })();
    return () => { mounted = false; };
  }, [clientId]);

  const handleView = () => {
    router.push(`/dashboard/superadmin/clients/enrollees?clientId=${clientId}`);
    onClose();
  };

  const total = data?.enrolleeCount ?? enrolleeCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">View Enrollees</h2>
        <p className="mt-2 text-sm text-slate-600">{clientName}</p>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Total Enrollees</p>
          <p className="text-2xl font-bold text-blue-600">{total}</p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleView}
            className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Enrollees
          </button>
        </div>
      </div>
    </div>
  );
}
