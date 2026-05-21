'use client';

import React from 'react';
import { MdClose } from 'react-icons/md';
import type { PaCode } from '../../types';

interface PaCodeDetailsModalProps {
  paCode: PaCode;
  isOpen: boolean;
  onClose: () => void;
}

const PaCodeDetailsModal: React.FC<PaCodeDetailsModalProps> = ({
  paCode,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Get initials from patient name
  const initials = paCode.patientName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  // Get background color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#10B9811A] text-[#10B981]';
      case 'under review':
        return 'bg-[#F59E0B1A] text-[#F59E0B]';
      case 'declined':
        return 'bg-[#EF44441A] text-[#EF4444]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl md:w-3xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300 px-4 py-4">
        {/* Close Button */}
        <div className='flex justify-end w-full mb-4'>
        <button
          onClick={onClose}
          className="hover:text-gray-600 transition-colors z-10 font-semibold"
        >
          <MdClose size={28} />
        </button>
      </div>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4 border border-[#D9D9D9] rounded-[10px]">
            <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(paCode.status)}`}>
                {paCode.status.charAt(0).toUpperCase() + paCode.status.slice(1)}
              </span>
            </div>

            <div className="flex items-start space-x-4 px-6 py-4">
              {/* Avatar */}
              <div className="shrink-0 w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>

              <div className="flex-1">
                <h4 className="text-2xl font-semibold text-gray-900">{paCode.patientName}</h4>
                <div className="grid grid-cols-4 gap-4 text-[15px]">
                  <div className='flex flex-col'>
                    <span className="font-medium">HMOID:</span>
                    <span className="font-semibold">{paCode.hmoid}</span>
                  </div>
                  <div className='flex flex-col col-span-2'>
                    <span className="font-medium">Email:</span>
                    <span className="font-semibold">{paCode.patientEmail || 'N/A'}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className="font-medium">Plan:</span>
                    <span className="font-semibold bg-[#49A8F4] text-white px-2 py-0.5 rounded-[5px] w-fit">
                      {paCode.patientPlan || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PA Code Information */}
          <div className="bg-white border border-[#D9D9D9] rounded-[10px]">
             <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Service Detail</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-4 text-[15px]">
              <div className='flex flex-col'>
                <span className="font-medium">PA Code:</span>
                <span className="font-semibold text-primary">{paCode.authorizationCode}</span>
              </div>
              <div className='flex flex-col'>
                <span className="font-medium">Date of Encounter</span>
                <span className="font-semibold">{formatDate(paCode.createdDate)}</span>
              </div>
              <div className='flex flex-col'>
                <span className="font-medium">Care Type:</span>
                <span className="font-semibold">{paCode.careType}</span>
              </div>
            </div>
          </div>

          <div className='bg-white border border-[#D9D9D9] rounded-[10px] space-y-4'>
            <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Medical Details</h3>
            </div>
          {/* Diagnosis */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mx-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Diagnosis</h3>
            <p className="text-amber-800 whitespace-pre-line">{paCode.diagnosis}</p>
          </div>

          {/* Treatment Description & Services Rendered */}
          <div className="px-6 py-4">
            <h3 className="text-[17px] font-semibold text-gray-900 mb-4">Treatment Description & Services Rendered</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#D9D9D9]">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Item Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Unit Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paCode.treatment.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-primary">{item.itemCode}</td>
                      <td className="px-4 py-3 text-sm">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm">₦{item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₦{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-4 py-3 text-right font-semibold">Total:</td>
                    <td className="px-4 py-3 font-bold text-primary">
                      ₦{paCode.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className='py-2 text-[15px]'>Requested by {paCode.requestedBy}</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaCodeDetailsModal;
