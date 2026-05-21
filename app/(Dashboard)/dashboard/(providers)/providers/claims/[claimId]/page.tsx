'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { MdClose } from 'react-icons/md';
import { MOCK_CLAIMS, type Claim, type ClaimStatus } from '../mockClaims';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'sonner';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusColor = (status: ClaimStatus) => {
  switch (status) {
    case 'approved':
      return 'bg-[#10B9811A] text-[#10B981]';
    case 'pending':
      return 'bg-[#F59E0B1A] text-[#F59E0B]';
    case 'rejected':
      return 'bg-[#EF44441A] text-[#EF4444]';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface ClaimDetailsModalProps {
  claim: Claim;
  isOpen: boolean;
  onClose: () => void;
}

const ClaimDetailsModal: React.FC<ClaimDetailsModalProps> = ({
  claim,
}) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{name: string, message: string}[]>([]);
  const [communications] = useState<{name: string, message: string}[]>([
    // Mock communications
    { name: 'Dr. Smith', message: 'Initial consultation completed.' },
    { name: 'Nurse Johnson', message: 'Follow-up required.' }
  ]);

  const totalAmount = useMemo(() => claim.treatment.reduce((sum, item) => sum + item.amount, 0), [claim.treatment]);

  // Get initials from patient name
  const initials = claim.patientName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
      <div className="w-full px-4 py-4">
        {/* Back Button */}
        <div className='flex w-full mb-4'>
        <Link href="/test/providers/claims"
          className="font-semibold p-2 rounded-full border border-border hover:bg-gray-100 flex items-center"
        >
          <IoIosArrowBack size={28} />
        </Link>
      </div>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4 border border-[#D9D9D9] rounded-[10px]">
            <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(claim.status)}`}>
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </span>
            </div>

            <div className="flex items-start space-x-4 px-6 py-4">
              {/* Avatar */}
              <div className="shrink-0 w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>

              <div className="flex-1">
                <h4 className="text-2xl font-semibold text-gray-900">{claim.patientName}</h4>
                <div className="grid grid-cols-4 gap-4 text-[15px]">
                  <div className='flex flex-col'>
                    <span className="font-medium">HMOID:</span>
                    <span className="font-semibold">{claim.hmoId}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 text-[15px]">
              <div className='flex flex-col'>
                <span className="font-medium">PA Code:</span>
                <span className="font-semibold text-primary">{claim.paCode}</span>
              </div>
              <div className='flex flex-col'>
                <span className="font-medium">Date of Encounter</span>
                <span className="font-semibold">{formatDate(claim.dateOfService)}</span>
              </div>
              <div className='flex flex-col'>
                <span className="font-medium">Date submitted</span>
                <span className="font-semibold">{formatDate(claim.dateSubmitted)}</span>
              </div>
              <div className='flex flex-col'>
                <span className="font-medium">Amount:</span>
                <span className="font-semibold">₦{claim.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className='bg-white border border-[#D9D9D9] rounded-[10px] space-y-4'>
            <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Medical Details</h3>
            </div>
          {/* Notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mx-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Diagnosis</h3>
            <p className="text-amber-800 whitespace-pre-line">{claim.notes}</p>
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
                  {claim.treatment.map((item, index) => (
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
                      ₦{totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          </div>
          {/* Provider Communication */}
          <div className="bg-white border border-[#D9D9D9] rounded-[10px] space-y-4 py-4">
            <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6">
              <h3 className="text-lg font-semibold text-gray-900">Provider Communication</h3>
            </div>
            <div className="px-6 py-4 space-y-2">
              {communications.map((comm, index) => (
                <div key={index} className="flex flex-col bg-[#E5E7EB4D] rounded-[5px] p-3">
                  <p className="font-semibold">{comm.name}</p>
                  <p className="text-gray-700">{comm.message}</p>
                </div>
              ))}
              {comments.map((comm, index) => (
                <div key={`comment-${index}`} className="">
                  <p className="font-semibold">{comm.name}</p>
                  <p className="text-gray-700">{comm.message}</p>
                </div>
              ))}
            </div>
            <div className="px-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Comment</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your comment"
                rows={4}
              />
              <button
                onClick={() => {
                  if (comment.trim()) {
                    setComments([...comments, { name: 'Provider', message: comment }]);
                    toast.success('Comment posted successfully');
                    setComment('');
                  } else {
                    toast.error('Please enter a comment');
                  }
                }}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Post Comment
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default function ClaimDetailsPage() {
  const params = useParams();
  const claimId = params?.claimId as string | undefined;

  const claim = useMemo(
    () => MOCK_CLAIMS.find((item: Claim) => item.id === claimId),
    [claimId]
  );

  if (!claim) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative bg-white rounded-xl shadow-2xl md:w-3xl w-full p-6">
          <p className="text-center text-sm font-semibold text-slate-700">Claim not found</p>
        </div>
      </div>
    );
  }

  return <ClaimDetailsModal claim={claim} isOpen={true} onClose={() => {}} />;
}