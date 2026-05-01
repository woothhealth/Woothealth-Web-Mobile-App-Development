'use client';

import { useState } from 'react';

interface DeactivateAccountModalProps {
  clientName: string;
  onClose: () => void;
}

export function DeactivateAccountModal({ clientName, onClose }: DeactivateAccountModalProps) {
  const [confirmation, setConfirmation] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (confirmation !== clientName) newErrors.confirmation = `Type "${clientName}" to confirm`;
    if (!reason.trim()) newErrors.reason = 'Reason is required';
    if (reason.length < 10) newErrors.reason = 'Please provide at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeactivate = () => {
    if (validate()) {
      // TODO: Submit deactivation to API
      alert(`Account for "${clientName}" deactivated\nReason: ${reason}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2">
            <span className="text-xl">⛔</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Deactivate Account</h2>
            <p className="text-xs text-red-600">This action is permanent</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600">{clientName}</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Confirm by typing company name
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder={clientName}
            />
            {errors.confirmation && <p className="mt-1 text-xs text-red-500">{errors.confirmation}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Reason for Deactivation</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              rows={3}
              placeholder="Provide detailed reason..."
            />
            {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
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
            onClick={handleDeactivate}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-300"
            disabled={Object.keys(errors).length > 0}
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
