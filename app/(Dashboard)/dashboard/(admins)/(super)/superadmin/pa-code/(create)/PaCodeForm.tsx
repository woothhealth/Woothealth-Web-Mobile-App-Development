'use client';

import React, { useState, useEffect } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import type { PaCodeFormData, TreatmentItem } from './create/page';

interface PaCodeFormProps {
  onSubmit: (formData: PaCodeFormData) => void;
  isSubmitting: boolean;
}

const PaCodeForm: React.FC<PaCodeFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<PaCodeFormData>({
    hmoid: '',
    dateOfEncounter: '',
    careType: '',
    diagnosis: '',
    treatmentItems: [
      {
        id: '1',
        itemCode: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      }
    ],
    requestedBy: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate total amount whenever treatment items change
  useEffect(() => {
    const total = formData.treatmentItems.reduce((sum, item) => sum + item.amount, 0);
    // Update the total display (we'll show this in the UI)
  }, [formData.treatmentItems]);

  const validateField = (name: string, value: string | number) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'hmoid':
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors.hmoid = 'HMOID is required';
        } else {
          delete newErrors.hmoid;
        }
        break;
      case 'dateOfEncounter':
        if (!value) {
          newErrors.dateOfEncounter = 'Date of encounter is required';
        } else {
          delete newErrors.dateOfEncounter;
        }
        break;
      case 'careType':
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors.careType = 'Care type is required';
        } else {
          delete newErrors.careType;
        }
        break;
      case 'diagnosis':
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors.diagnosis = 'Diagnosis is required';
        } else {
          delete newErrors.diagnosis;
        }
        break;
      case 'requestedBy':
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors.requestedBy = 'Requested by is required';
        } else {
          delete newErrors.requestedBy;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleTreatmentItemChange = (id: string, field: keyof TreatmentItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      treatmentItems: prev.treatmentItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate amount when quantity or unitPrice changes
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.amount = (updatedItem.quantity || 0) * (updatedItem.unitPrice || 0);
          }

          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addTreatmentItem = () => {
    const newItem: TreatmentItem = {
      id: Date.now().toString(),
      itemCode: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };

    setFormData(prev => ({
      ...prev,
      treatmentItems: [...prev.treatmentItems, newItem]
    }));
  };

  const removeTreatmentItem = (id: string) => {
    if (formData.treatmentItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        treatmentItems: prev.treatmentItems.filter(item => item.id !== id)
      }));
    }
  };

  const calculateTotalAmount = () => {
    return formData.treatmentItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const fieldsToValidate = ['hmoid', 'dateOfEncounter', 'careType', 'diagnosis', 'requestedBy'];
    fieldsToValidate.forEach(field => validateField(field, formData[field as keyof PaCodeFormData] as string));

    // Check treatment items
    const invalidItems = formData.treatmentItems.filter(
      item => !item.itemCode.trim() || !item.description.trim() || item.quantity <= 0 || item.unitPrice <= 0
    );

    if (invalidItems.length > 0) {
      setErrors(prev => ({ ...prev, treatmentItems: 'Please fill in all treatment item fields with valid values' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.treatmentItems;
        return newErrors;
      });
    }

    // If no errors, submit
    if (Object.keys(errors).length === 0 && invalidItems.length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#ffffff] rounded-[15px] shadow-sm p-6">
      {/* Basic Information */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HMOID */}
          <div>
            <label htmlFor="hmoid" className="block mb-2">
              HMOID
            </label>
            <input
              type="text"
              id="hmoid"
              name="hmoid"
              value={formData.hmoid}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A5EF] ${
                errors.hmoid ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Enter HMOID"
            />
            {errors.hmoid && <p className="mt-1 text-sm text-red-600">{errors.hmoid}</p>}
          </div>

          {/* Date of Encounter */}
          <div>
            <label htmlFor="dateOfEncounter" className="block mb-2">
              Date of Encounter *
            </label>
            <input
              type="date"
              id="dateOfEncounter"
              name="dateOfEncounter"
              value={formData.dateOfEncounter}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A5EF] ${
                errors.dateOfEncounter ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            {errors.dateOfEncounter && <p className="mt-1 text-sm text-red-600">{errors.dateOfEncounter}</p>}
          </div>

          {/* Care Type */}
          <div>
            <label htmlFor="careType" className="block mb-2">
              Care Type *
            </label>
            <select
              id="careType"
              name="careType"
              value={formData.careType}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A5EF] ${
                errors.careType ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            >
              <option value="">Select care type</option>
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Emergency">Emergency</option>
              <option value="Surgical">Surgical</option>
              <option value="Medical">Medical</option>
              <option value="Diagnostic">Diagnostic</option>
            </select>
            {errors.careType && <p className="mt-1 text-sm text-red-600">{errors.careType}</p>}
          </div>

         
        </div>

        {/* Diagnosis */}
        <div className="mt-6">
          <label htmlFor="diagnosis" className="block mb-2">
            Diagnosis *
          </label>
          <textarea
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            disabled={isSubmitting}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A5EF] ${
              errors.diagnosis ? 'border-red-500' : 'border-gray-300'
            } disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
            placeholder="Enter diagnosis details"
          />
          {errors.diagnosis && <p className="mt-1 text-sm text-red-600">{errors.diagnosis}</p>}
        </div>
      </div>

      {/* Treatment Description & Services Rendered */}
      <div className="border border-[#D9D9D9] rounded-[15px]">
        <div className="p-4 border-b border-[#D9D9D9]">
          <h2 className="text-lg font-semibold">Treatment Description & Services Rendered</h2>
        </div>

        <div className="overflow-auto p-4 space-y-2 max-h-90 custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#D9D9D9]">
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Item Code</th>
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Description</th>
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Quantity</th>
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Unit Price</th>
                <th className="px-4 py-3 text-left text-[15px] font-semibold">Amount</th>
                <th className="px-4 py-3 text-center text-[15px] font-semibold border-b border-[#D9D9D9]">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.treatmentItems.map((item, index) => (
                <tr key={item.id} className="divide-y divide-[#D9D9D9] text-sm">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.itemCode}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'itemCode', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                      placeholder="Enter item code"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'description', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                      placeholder="Enter description"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#49A5EF] disabled:bg-gray-100"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.amount.toFixed(2)}
                      readOnly
                      className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-700"
                    />
                  </td>
                  <td className="px-4 py-3 text-center border-b border-[#D9D9D9]">
                    {formData.treatmentItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTreatmentItem(item.id)}
                        disabled={isSubmitting}
                        className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addTreatmentItem}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-2 py-1 text-xs bg-transparent hover:bg-blue-200 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed border rounded-[10px] border-[#D9D9D9]"
          >
            <MdAdd size={20} />
            Add Item
          </button>
          {errors.treatmentItems && <p className="mt-4 text-sm text-red-600">{errors.treatmentItems}</p>}
        </div>

        {/* Total Billed Amount */}
        <div className="flex justify-end border-t border-[#D9D9D9] p-4">
          <div className="px-4 py-3 rounded-[15px] border border-[#D9D9D9] flex items-center space-x-4">
            <h2 className="text-sm text-gray-600">Total Billed Amount</h2>
            <div className="text-xl font-bold border border-[#D9D9D9] rounded-[10px] px-2 py-1">
              ₦{calculateTotalAmount().toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

       {/* Requested By */}
          <div>
            <label htmlFor="requestedBy" className="block mb-2">
              Requested By *
            </label>
            <input
              type="text"
              id="requestedBy"
              name="requestedBy"
              value={formData.requestedBy}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A5EF] ${
                errors.requestedBy ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Enter requester name"
            />
            {errors.requestedBy && <p className="mt-1 text-sm text-red-600">{errors.requestedBy}</p>}
          </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#49A5EF] text-white font-semibold rounded-lg hover:bg-[#49A5EF]/90 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            'Request PA Code'
          )}
        </button>
      </div>
    </form>
  );
};

export default PaCodeForm;
