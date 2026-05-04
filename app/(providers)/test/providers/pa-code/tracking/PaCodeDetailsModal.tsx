'use client';

import React from 'react';
import { MdClose } from 'react-icons/md';
import type { PaCode } from '../types';

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
        return 'bg-green-100 text-green-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
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
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <MdClose size={24} />
        </button>

        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold">PA Code Details</h2>
          <p className="text-blue-100 mt-1">Authorization Code: {paCode.authorizationCode}</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(paCode.status)}`}>
                {paCode.status.charAt(0).toUpperCase() + paCode.status.slice(1)}
              </span>
            </div>

            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="shrink-0 w-16 h-16 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {initials}
              </div>

              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{paCode.patientName}</h4>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">HMOID:</span>
                    <span className="ml-2 font-mono">{paCode.hmoid}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <span className="ml-2">{paCode.patientEmail || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Plan:</span>
                    <span className="ml-2">{paCode.patientPlan || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Date of Service:</span>
                    <span className="ml-2">{formatDate(paCode.dateOfService)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PA Code Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">PA Code Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-600">PA Code:</span>
                <span className="ml-2 font-mono font-semibold">{paCode.authorizationCode}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Care Type:</span>
                <span className="ml-2">{paCode.careType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Provider:</span>
                <span className="ml-2">{paCode.providerName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Requested By:</span>
                <span className="ml-2">{paCode.requestedBy}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Created Date:</span>
                <span className="ml-2">{formatDate(paCode.createdDate)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Total Amount:</span>
                <span className="ml-2 font-semibold text-green-600">
                  ₦{paCode.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Diagnosis</h3>
            <p className="text-amber-800 whitespace-pre-line">{paCode.diagnosis}</p>
          </div>

          {/* Treatment Description & Services Rendered */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Description & Services Rendered</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Item Code</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Unit Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {paCode.treatment.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm font-mono">{item.itemCode}</td>
                      <td className="px-4 py-3 text-sm">{item.description}</td>
                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm">₦{item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₦{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-4 py-3 text-right font-semibold">Total:</td>
                    <td className="px-4 py-3 font-bold text-green-600">
                      ₦{paCode.totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end p-6 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaCodeDetailsModal;
