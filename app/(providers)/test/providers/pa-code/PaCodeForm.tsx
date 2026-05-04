'use client';

import React, { useState, useEffect } from 'react';
import { MdAdd, MdDelete } from 'react-icons/md';
import type { PaCodeFormData, TreatmentItem } from './page';

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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HMOID */}
          <div>
            <label htmlFor="hmoid" className="block text-sm font-medium text-gray-700 mb-2">
              HMOID *
            </label>
            <input
              type="text"
              id="hmoid"
              name="hmoid"
              value={formData.hmoid}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hmoid ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Enter HMOID"
            />
            {errors.hmoid && <p className="mt-1 text-sm text-red-600">{errors.hmoid}</p>}
          </div>

          {/* Date of Encounter */}
          <div>
            <label htmlFor="dateOfEncounter" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Encounter *
            </label>
            <input
              type="date"
              id="dateOfEncounter"
              name="dateOfEncounter"
              value={formData.dateOfEncounter}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dateOfEncounter ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            {errors.dateOfEncounter && <p className="mt-1 text-sm text-red-600">{errors.dateOfEncounter}</p>}
          </div>

          {/* Care Type */}
          <div>
            <label htmlFor="careType" className="block text-sm font-medium text-gray-700 mb-2">
              Care Type *
            </label>
            <select
              id="careType"
              name="careType"
              value={formData.careType}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

          {/* Requested By */}
          <div>
            <label htmlFor="requestedBy" className="block text-sm font-medium text-gray-700 mb-2">
              Requested By *
            </label>
            <input
              type="text"
              id="requestedBy"
              name="requestedBy"
              value={formData.requestedBy}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.requestedBy ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder="Enter requester name"
            />
            {errors.requestedBy && <p className="mt-1 text-sm text-red-600">{errors.requestedBy}</p>}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mt-6">
          <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis *
          </label>
          <textarea
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleInputChange}
            disabled={isSubmitting}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.diagnosis ? 'border-red-500' : 'border-gray-300'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            placeholder="Enter diagnosis details"
          />
          {errors.diagnosis && <p className="mt-1 text-sm text-red-600">{errors.diagnosis}</p>}
        </div>
      </div>

      {/* Treatment Description & Services Rendered */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Treatment Description & Services Rendered</h2>
          <button
            type="button"
            onClick={addTreatmentItem}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <MdAdd size={20} />
            Add Item
          </button>
        </div>

        {errors.treatmentItems && <p className="mb-4 text-sm text-red-600">{errors.treatmentItems}</p>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Item Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Unit Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Amount</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.treatmentItems.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.itemCode}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'itemCode', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                      placeholder="Enter item code"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleTreatmentItemChange(item.id, 'description', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
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
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
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
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
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
                  <td className="px-4 py-3 text-center">
                    {formData.treatmentItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTreatmentItem(item.id)}
                        disabled={isSubmitting}
                        className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Billed Amount */}
        <div className="mt-6 flex justify-end">
          <div className="bg-gray-50 px-6 py-4 rounded-lg border">
            <div className="text-sm text-gray-600">Total Billed Amount</div>
            <div className="text-2xl font-bold text-gray-900">
              ₦{calculateTotalAmount().toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
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
