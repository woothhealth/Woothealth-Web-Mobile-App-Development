'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateAdminClient } from '@/lib/adminClients';

interface ActivateAccountModalProps {
  clientId?: string;
  mainCompany: string;
  onClose: () => void;
}

export function ActivateAccountModal({ clientId, mainCompany, onClose }: ActivateAccountModalProps) {
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (confirmation !== mainCompany) newErrors.confirmation = `Type "${mainCompany}" to confirm`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleActivate = async () => {
    if (!validate()) return;
    if (!clientId) {
      toast.error('Missing client id');
      return;
    }

    try {
      await updateAdminClient(clientId, { status: 'Active' });
      toast.success(`Account for "${mainCompany}" activated`);
      onClose();
    } catch (err) {
      console.error('Activate error', err);
      toast.error('Failed to Activate account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
        <div className="flex">
          <div>
            <h2 className="text-lg font-semibold">Activate <span className="uppercase">{mainCompany}</span> Account</h2>
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
              className="mt-1 w-full rounded-[10px] border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder={mainCompany}
            />
            {errors.confirmation && <p className="mt-1 text-xs text-red-500">{errors.confirmation}</p>}
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
            onClick={handleActivate}
            className="flex-1 rounded-[10px] bg-[#10B981] px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
            disabled={confirmation !== mainCompany}
          >
            Activate
          </button>
        </div>
      </div>
    </div>
  );
}
