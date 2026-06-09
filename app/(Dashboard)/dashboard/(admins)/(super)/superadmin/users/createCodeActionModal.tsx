'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { MdClose } from 'react-icons/md';
import type { User } from './types/user';
import PaCodeForm from '../UIs/PaCodeForm';

interface CreateCodeActionModalProps {
  user: User;
  onClose: () => void;
  onCreated?: () => void;
}

const CreateCodeActionModal: React.FC<CreateCodeActionModalProps> = ({ user, onClose, onCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmitPaCode = async (formData: any) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // basic validation is handled by PaCodeForm, but ensure user id exists
      if (!user?.userId) {
        toast.error('User id not available for PA code creation');
        setIsSubmitting(false);
        return;
      }

      const total = formData.treatmentItems.reduce((s: number, it: any) => s + it.amount, 0);
      const authorizationCode = `WHT-PA-${Math.floor(100000 + Math.random() * 900000)}`;
      const payload = {
        patientId: user.userId,
        diagnosis: (formData.diagnosis || []).join('; '),
        tariffCode: formData.treatmentItems[0]?.itemCode || '',
        tier: formData.careType,
        price: total.toFixed(2).toString(),
        bookingId: '',
        authorizationCode,
      };

      const res = await fetch('/api/admin/pa-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || `Request failed with status ${res.status}`);
      }

      toast.success('PA Code request submitted successfully!');
      setSubmissionSuccess(s => !s);
      if (onCreated) onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit PA Code request');
      console.error('PA submit error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="inset-0 absolute cursor-pointer" onClick={onClose} />
      <div className="w-full md:w-3xl rounded-[15px] bg-white p-6 shadow-xl space-y-4 relative h-full overflow-auto custom-scrollbar">
        <button onClick={onClose} className="absolute right-4 top-4"><MdClose size={22} /></button>
        <h2 className="text-lg font-semibold text-slate-900">Create PA Code for {user.firstName} {user.lastName}</h2>
        <PaCodeForm onSubmit={handleSubmitPaCode} isSubmitting={isSubmitting} submissionSuccess={submissionSuccess} userId={user.userId} />
      </div>
    </div>
  );
};

export default CreateCodeActionModal;
