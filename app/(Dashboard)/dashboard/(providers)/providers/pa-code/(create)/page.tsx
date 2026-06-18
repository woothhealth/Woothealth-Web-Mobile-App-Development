"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PaCodeForm from './PaCodeForm';
import { createProviderPA } from '@/lib/providerPA';

export interface TreatmentItem {
  id: string;
  item: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  itemCode?: string;
}

export interface PaCodeFormData {
  hmoid: string;
  dateOfEncounter: string;
  careType: string;
  diagnosis: string;
  treatmentItems: TreatmentItem[];
  requestedBy: string;
}

const PaCodeCreationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

      if (!formData.diagnosis.trim()) {
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
        item => !item.item.trim() || item.quantity <= 0 || item.unitPrice <= 0
      );

      if (invalidItems.length > 0) {
        toast.error('Please fill in all treatment item fields with valid values');
        setIsSubmitting(false);
        return;
      }

      // Build payload expected by backend, include treatment items and totals
      const total = (formData.treatmentItems || []).reduce((s, it) => s + (Number(it.amount) || 0), 0);
      const backendTreatmentItems = (formData.treatmentItems || []).map(it => ({
        itemCode: it.itemCode,
        item: it.item || '',
        description: it.item || '',
        quantity: it.quantity || 1,
        unitPrice: Number(it.unitPrice) || 0,
        Amount: Number(it.amount) || ((it.quantity || 1) * (Number(it.unitPrice) || 0)),
      }));

      const payload = {
        patientId: formData.hmoid,
        diagnosis: formData.diagnosis,
        tariffCode: backendTreatmentItems[0]?.item || '',
        tier: formData.careType,
        price: total.toFixed(2).toString(),
        bookingId: '',
        totalAmount: total,
        treatmentItems: backendTreatmentItems,
      };

      console.log('[page] createProviderPA payload', payload);

      try {
        await createProviderPA(payload);
        toast.success('PA Code request submitted successfully!');
        // Navigate to tracking page after success
        router.push('/dashboard/providers/pa-code/tracking');
        return;
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
    <div className="h-full px-3 md:px-0 py-4">
      <div className="w-full mx-auto">
        {/* PA Code Form */}
        <PaCodeForm
          onSubmit={handleSubmitPaCode}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default PaCodeCreationPage;
