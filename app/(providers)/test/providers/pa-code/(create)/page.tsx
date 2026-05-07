'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import PaCodeForm from './PaCodeForm';

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
  diagnosis: string;
  treatmentItems: TreatmentItem[];
  requestedBy: string;
}

const PaCodeCreationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        item => !item.itemCode.trim() || !item.description.trim() || item.quantity <= 0 || item.unitPrice <= 0
      );

      if (invalidItems.length > 0) {
        toast.error('Please fill in all treatment item fields with valid values');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success
      toast.success('PA Code request submitted successfully!');
      console.log('PA Code submitted:', formData);

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
