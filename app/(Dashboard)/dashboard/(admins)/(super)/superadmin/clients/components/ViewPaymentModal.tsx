'use client';

interface ViewPaymentModalProps {
  clientName: string;
  onClose: () => void;
}

export function ViewPaymentModal({ clientName, onClose }: ViewPaymentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">View Payment History</h2>
        <p className="mt-2 text-sm text-slate-600">{clientName}</p>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Last Payment</p>
            <p className="text-lg font-semibold text-slate-900">₦250,000</p>
            <p className="mt-1 text-xs text-slate-500">2024-04-15</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Total Paid</p>
            <p className="text-lg font-semibold text-slate-900">₦1,500,000</p>
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
