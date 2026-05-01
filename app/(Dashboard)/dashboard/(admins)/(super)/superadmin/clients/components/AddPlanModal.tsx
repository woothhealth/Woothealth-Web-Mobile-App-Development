'use client';

import { useState } from 'react';

interface AddPlanModalProps {
  clientName: string;
  onClose: () => void;
}

export function AddPlanModal({ clientName, onClose }: AddPlanModalProps) {
  const [planName, setPlanName] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!planName.trim()) newErrors.planName = 'Plan name is required';
    if (!amount.trim()) newErrors.amount = 'Amount is required';
    if (amount && isNaN(Number(amount))) newErrors.amount = 'Amount must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // TODO: Submit plan to API
      alert(`Plan "${planName}" added with amount ₦${amount}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Add New Plan</h2>
        <p className="mt-2 text-sm text-slate-600">{clientName}</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Plan Name</label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Premium Plan"
            />
            {errors.planName && <p className="mt-1 text-xs text-red-500">{errors.planName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="e.g., 250000"
            />
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
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
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300"
            disabled={Object.keys(errors).length > 0}
          >
            Add Plan
          </button>
        </div>
      </div>
    </div>
  );
}
