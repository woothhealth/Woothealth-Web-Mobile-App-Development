'use client';

import { useEffect, useState } from 'react';

interface ViewPaymentModalProps {
  clientId?: string;
  clientName: string;
  onClose: () => void;
}

export function ViewPaymentModal({ clientId, clientName, onClose }: ViewPaymentModalProps) {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    if (!clientId) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/admin/clients?clientId=${encodeURIComponent(clientId)}`, { credentials: 'include' });
        const json = await res.json().catch(() => null);
        if (!mounted) return;
        setData(json?.data || json);
        // eslint-disable-next-line no-console
        console.debug('ViewPaymentModal backend data:', json);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching payment data', err);
      }
    })();
    return () => { mounted = false; };
  }, [clientId]);

  const lastPayment = data?.lastPayment ?? { amount: '—', date: '—' };
  const totalPaid = data?.totalPaid ?? '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl mx-auto">
        <h2 className="text-lg font-semibold">View Payment History</h2>
        <p className="mt-2 text-sm text-slate-600">{clientName}</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Last Payment</p>
            <p className="text-lg font-semibold text-slate-900">{typeof lastPayment.amount === 'number' ? `₦${Number(lastPayment.amount).toLocaleString()}` : lastPayment.amount}</p>
            <p className="mt-1 text-xs text-slate-500">{lastPayment.date}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Total Paid</p>
            <p className="text-lg font-semibold text-slate-900">{typeof totalPaid === 'number' ? `₦${Number(totalPaid).toLocaleString()}` : totalPaid}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
