'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateAdminClient } from '@/lib/adminClients';

interface DeactivateAccountModalProps {
  clientId?: string;
  clientName: string;
  onClose: () => void;
}

export function DeactivateAccountModal({ clientId, clientName, onClose }: DeactivateAccountModalProps) {
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

  const handleDeactivate = async () => {
    if (!validate()) return;
    if (!clientId) {
      toast.error('Missing client id');
      return;
    }

    try {
      await updateAdminClient(clientId, { status: 'Inactive', deactivationReason: reason });
      toast.success(`Account for "${clientName}" deactivated`);
      onClose();
    } catch (err) {
      console.error('Deactivate error', err);
      toast.error('Failed to deactivate account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl z-20">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2">
            <span className="text-xl">⛔</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Deactivate <span className="uppercase">{clientName}</span> Account</h2>
            <p className="text-xs text-red-600">This action is permanent</p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-[15px] font-medium">
              Confirm by typing company name
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="mt-1 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder={clientName}
            />
            {errors.confirmation && <p className="mt-1 text-xs text-red-500">{errors.confirmation}</p>}
          </div>

          <div>
            <label className="block text-[15px] font-medium text-slate-700">Reason for Deactivation</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 w-full rounded-[10px] border border-border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Provide detailed reason..."
            />
            {errors.reason && <p className="mt-1 text-xs text-red-500">{errors.reason}</p>}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-[10px] border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeactivate}
            className="flex-1 rounded-[10px] bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-300"
            disabled={confirmation !== clientName || reason.trim().length < 10}
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}
