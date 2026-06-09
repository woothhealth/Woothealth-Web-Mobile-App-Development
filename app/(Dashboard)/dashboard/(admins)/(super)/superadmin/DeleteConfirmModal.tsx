'use client';

import type { ReactNode } from 'react';

interface DeleteConfirmModalProps {
  title: string;
  description: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  isProcessing?: boolean;
  processingLabel?: string;
}

export default function DeleteConfirmModal({
  title,
  description,
  onCancel,
  onConfirm,
  confirmLabel = 'Delete',
  isProcessing = false,
  processingLabel,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-3 text-sm text-slate-600">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
          >
            {isProcessing ? (processingLabel || confirmLabel) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
