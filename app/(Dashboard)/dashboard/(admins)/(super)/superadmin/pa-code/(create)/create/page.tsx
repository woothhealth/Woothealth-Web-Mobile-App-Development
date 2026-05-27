"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import PaCodeForm from '../PaCodeForm';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export interface TreatmentItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PaCodeFormData {
  hmoid: string;
  dateOfEncounter: string;
  careType: string;
  diagnosis: string[];
  treatmentItems: TreatmentItem[];
  requestedBy: string;
}

const PaCodeCreationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmitPaCode = async (formData: PaCodeFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Validate required fields
      if (!formData.hmoid.trim()) {
        toast.error('HMOID is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.dateOfEncounter) {
        toast.error('Date of encounter is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.careType.trim()) {
        toast.error('Care type is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.diagnosis || formData.diagnosis.length === 0) {
        toast.error('Diagnosis is required');
        setIsSubmitting(false);
        return;
      }

      if (formData.treatmentItems.length === 0) {
        toast.error('At least one treatment item is required');
        setIsSubmitting(false);
        return;
      }

      if (!formData.requestedBy.trim()) {
        toast.error('Requested by field is required');
        setIsSubmitting(false);
        return;
      }

      // Check if all treatment items are valid
      const invalidItems = formData.treatmentItems.filter(
        item => !item.itemCode.trim() || !item.description.trim() || item.quantity <= 0 || item.unitPrice <= 0
      );

      if (invalidItems.length > 0) {
        toast.error('Please fill in all treatment item fields with valid values');
        setIsSubmitting(false);
        return;
      }

      // Build payload expected by backend
      const total = formData.treatmentItems.reduce((s, it) => s + it.amount, 0);
      const authorizationCode = `WHT-PA-${Math.floor(100000 + Math.random() * 900000)}`;
      const payload = {
        patientId: formData.hmoid,
        diagnosis: (formData.diagnosis || []).join('; '),
        tariffCode: formData.treatmentItems[0]?.itemCode || '',
        tier: formData.careType,
        price: total.toFixed(2).toString(),
        bookingId: '',
        authorizationCode,
      };

      try {
        const res = await fetch('/api/admin/pa-codes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || `Request failed with status ${res.status}`);
        }

        toast.success('PA Code request submitted successfully!');
        // toggle the flag so child detects every success
        setSubmissionSuccess(s => !s);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to submit PA Code request');
        console.error('PA submit error', err);
      }

    } catch (error) {
      toast.error('Failed to submit PA Code request. Please try again.');
      console.error('PA Code submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full px-4 md:px-0 py-4">
      <div className="w-full mx-auto">
        <Link href="/dashboard/superadmin/pa-code" className="flex items-center text-sm text-gray-600 mb-4 hover:text-gray-800 transition-colors border-2 border-border w-fit rounded-full p-2">
          <MdArrowBack size={20} />
        </Link>
        {/* PA Code Form */}
        <PaCodeForm
          onSubmit={handleSubmitPaCode}
          isSubmitting={isSubmitting}
          submissionSuccess={submissionSuccess}
        />
      </div>
    </div>
  );
};

export default PaCodeCreationPage;