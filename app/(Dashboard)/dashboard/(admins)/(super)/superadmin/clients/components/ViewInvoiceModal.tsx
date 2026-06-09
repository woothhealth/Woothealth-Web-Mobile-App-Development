'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ViewInvoiceModalProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
}

export function ViewInvoiceModal({ clientId, clientName, onClose }: ViewInvoiceModalProps) {
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
        // log backend payload
        // eslint-disable-next-line no-console
        console.debug('ViewInvoiceModal backend data:', json);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching client invoice data', err);
      }
    })();
    return () => { mounted = false; };
  }, [clientId]);

  const handleView = () => {
    router.push(`/superadmin/clients/invoice?clientId=${clientId}`);
    onClose();
  };

  const outstanding = data?.outstanding ?? '₦0';
  const latestInvoice = data?.latestInvoice ?? { ref: '—', date: '—' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">View Invoice</h2>
        <p className="mt-2 text-sm text-slate-600">{clientName}</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Outstanding Balance</p>
            <p className="text-2xl font-bold text-red-600">{typeof outstanding === 'number' ? `₦${Number(outstanding).toLocaleString()}` : outstanding}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Latest Invoice</p>
            <p className="text-sm font-semibold text-slate-900">{latestInvoice?.ref || '—'}</p>
            <p className="mt-1 text-xs text-slate-500">{latestInvoice?.date || '—'}</p>
          </div>
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
            View Invoices
          </button>
        </div>
      </div>
    </div>
  );
}
