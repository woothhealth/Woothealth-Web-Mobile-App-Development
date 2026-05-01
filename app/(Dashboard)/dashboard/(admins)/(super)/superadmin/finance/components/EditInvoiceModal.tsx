'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Invoice, AccountType, InvoiceStatus } from '../mock-finance';

interface EditInvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
}

const statusOptions: InvoiceStatus[] = ['Paid', 'Pending', 'Overdue', 'Refund Request', 'Cancelled'];
const accountTypeOptions: AccountType[] = ['Retail Account', 'Business Account'];

export default function EditInvoiceModal({ invoice, onClose, onSave }: EditInvoiceModalProps) {
  const [formData, setFormData] = useState<Invoice>(
    invoice || {
      id: '',
      invoiceId: '',
      client: '',
      amount: 0,
      accountType: 'Business Account',
      status: 'Pending',
      date: '',
      dueDate: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoiceId.trim()) newErrors.invoiceId = 'Invoice ID is required';
    if (!formData.client.trim()) newErrors.client = 'Client name is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof Invoice, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full md:w-3xl rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Edit Invoice</h2>
          <button onClick={onClose} className="hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-98 overflow-y-auto custom-scrollbar pr-2">
          <div className='flex flex-col md:flex-row md:space-x-6 md:space-y-0 space-y-4 w-full'>
            <div className='w-full'>
              <label className="block text-sm font-medium text-gray-700">Invoice ID</label>
              <input
                type="text"
                value={formData.invoiceId}
                onChange={(e) => handleChange('invoiceId', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              />
              {errors.invoiceId && <p className="mt-1 text-sm text-red-500">{errors.invoiceId}</p>}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Client Name</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => handleChange('client', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              />
              {errors.client && <p className="mt-1 text-sm text-red-500">{errors.client}</p>}
            </div>
          </div>

          <div className='flex flex-col md:flex-row md:space-x-6 w-full md:space-y-0 space-y-4'>
            <div className='w-full'>
              <label className="block text-sm font-medium text-gray-700">Amount (₦)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              />
              {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
            </div>

            <div className='w-full'>
              <label className="block text-sm font-medium text-gray-700">Account Type</label>
              <select
                value={formData.accountType}
                onChange={(e) => handleChange('accountType', e.target.value as AccountType)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              >
                {accountTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex flex-col md:flex-row md:space-x-6 w-full md:space-y-0 space-y-4'>
            <div className='w-full'>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as InvoiceStatus)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className='w-full'>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              />
              {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
            </div>
          </div>

          <div className='flex flex-col md:flex-row md:space-x-6 w-full md:space-y-0 space-y-4'>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
            </div>
          </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#49A5EF] px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                disabled={Object.keys(errors).length > 0}
              >
                Save Changes
              </button>
            </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #00000032;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}
