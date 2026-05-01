'use client';

import { useRouter } from 'next/navigation';

interface ViewInvoiceModalProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
}

export function ViewInvoiceModal({ clientId, clientName, onClose }: ViewInvoiceModalProps) {
  const router = useRouter();

  const handleView = () => {
    router.push(`/superadmin/clients/invoice?clientId=${clientId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">View Invoice</h2>
        <p className="mt-2 text-sm text-slate-600">{clientName}</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Outstanding Balance</p>
            <p className="text-2xl font-bold text-red-600">₦100,000</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Latest Invoice</p>
            <p className="text-sm font-semibold text-slate-900">INV-2024-001</p>
            <p className="mt-1 text-xs text-slate-500">2024-04-01</p>
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
