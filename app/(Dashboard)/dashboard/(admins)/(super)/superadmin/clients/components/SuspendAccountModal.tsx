'use client';

import { useState } from 'react';

interface SuspendAccountModalProps {
  clientName: string;
  onClose: () => void;
}

export function SuspendAccountModal({ clientName, onClose }: SuspendAccountModalProps) {
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!reason.trim()) newErrors.reason = 'Reason is required';
    if (reason.length < 10) newErrors.reason = 'Please provide at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSuspend = () => {
    if (validate()) {
      // TODO: Submit suspension to API
      alert(`Account for "${clientName}" suspended\nReason: ${reason}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-yellow-100 p-2">
            <span className="text-xl">⚠️</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Suspend Account</h2>
            <p className="text-sm text-slate-600">{clientName}</p>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700">Reason for Suspension</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={3}
            placeholder="Please provide a reason for suspension..."
          />
          {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSuspend}
            className="flex-1 rounded-2xl bg-yellow-500 px-4 py-3 text-sm font-medium text-white hover:bg-yellow-600 disabled:bg-slate-300"
            disabled={Object.keys(errors).length > 0}
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  );
}
