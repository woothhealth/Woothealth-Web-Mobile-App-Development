'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { toast } from 'sonner';
import Claims from '../(home)/Claims';

interface Claim {
  id: string;
  dateOfService: string;
  userId: string;
  planType: string;
  hospitalProvider: string;
  userName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  patientName?: string;
  hmoId?: string;
  paCode?: string;
  claimType: string;
  policyStartDate?: string;
  policyEndDate?: string;
  totalAmount: number;
  assignedExaminer?: string;
  dateSubmitted?: string;
  treatment?: Array<{
    itemCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  notes?: string;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusColor = (status: string) => {
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

async function getClaim(claimId: string): Promise<Claim | null> {
  try {
    const response = await fetch(`/api/admin/claims?id=${encodeURIComponent(claimId)}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Handle different response structures
    if (data.success) {
      // Check if data.data.claims is an array (like bulk fetch)
      if (data.data && data.data.claims && Array.isArray(data.data.claims)) {
        const foundClaim = data.data.claims.find((c: Claim) => c.id === claimId);
        if (foundClaim) {
          return foundClaim;
        }
        // If not found by id, try the first one (assuming single claim response)
        if (data.data.claims.length === 1) {
          return data.data.claims[0];
        }
      }
      // Check if data.data is an array
      else if (Array.isArray(data.data)) {
        const foundClaim = data.data.find((c: Claim) => c.id === claimId);
        if (foundClaim) {
          return foundClaim;
        }
        // If not found, try the first one
        if (data.data.length === 1) {
          return data.data[0];
        }
      }
      // Check if data.data is a single claim object
      else if (data.data && typeof data.data === 'object' && data.data.id) {
        return data.data;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="uppercase text-[13px]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

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

  const totalAmount = useMemo(() => {
    if (claim.treatment && claim.treatment.length > 0) {
      return claim.treatment.reduce((sum, item) => sum + item.amount, 0);
    }
    return claim.amount || 0;
  }, [claim.treatment, claim.amount]);

  // Get initials from enrollee name
  const initials = (claim.userName || 'Unknown Enrollee')
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([...comments, { name: 'Admin', message: comment }]);
      setComment('');
      toast.success('Comment posted successfully');
    } else {
      toast.error('Please enter a comment');
    }
  };

  return (
    <div className="w-full px-4 py-4">
      {/* Back Button */}
      <div className='flex w-full mb-4'>
        <Link href="/dashboard/superadmin/claims"
          className="font-semibold p-2 rounded-full border border-border hover:bg-gray-100 flex items-center"
        >
          <IoIosArrowBack size={28} />
        </Link>
      </div>

      <div className='border border-border rounded-[10px] space-y-6 shadow-sm py-2'>
        <h2 className='text-lg font-semibold px-6 pb-2 border-b border-border'>Claim Identifiers</h2>
        <div className='px-6 py-2 space-y-4 grid grid-cols-1 md:grid-cols-3'>
            <DetailCard label="Total Billed Amount" value={claim.amount ? `₦${claim.amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'} />
            <DetailCard label='Date of encounter' value={claim.dateOfService ? formatDate(claim.dateOfService) : 'N/A'} />
            <DetailCard label='Date Submitted' value={claim.dateSubmitted ? formatDate(claim.dateSubmitted) : 'N/A'} />
            <DetailCard label='Claim type' value={claim.claimType || 'N/A'} />
            <DetailCard label='Providers' value={claim.hospitalProvider || 'N/A'} />
            <DetailCard label='Assigned Examiner' value={claim.assignedExaminer || 'N/A'} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Enrollee Information */}
        <div className="space-y-4 py-2 shadow-sm border border-border rounded-[10px]">
          <h2 className='text-lg font-semibold px-6 pb-2 border-b border-border'>Enrollee information</h2>
          <div className="flex items-start space-x-4 px-6 py-4">
            {/* Avatar */}
            <div className="shrink-0 w-20 h-20 rounded-[10px] bg-linear-to-br from-blue-400 to-primary flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>

            <div className="flex-1 space-y-1">
              <h4 className="text-xl font-semibold text-gray-900">{claim.userName || 'Unknown Enrollee'}</h4>
              <div className="grid grid-cols-4 gap-4 text-[15px]">
                <div className='flex flex-col'>
                  <span className="font-medium">HMOID</span>
                  <span className="font-semibold">{claim.hmoId || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="px-3 py-2 rounded-[10px] font-medium bg-primary text-white items-end">
              Event Log
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Service Detail */}
        <div className="border border-border rounded-[10px] space-y-4 py-4">
          <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 pb-4">
            <h3 className="text-lg font-semibold text-gray-900">Plan Types & Benefits</h3>
          </div>
          <div className="flex flex-col bg-primary px-6 py-4 text-[15px] rounded-[10px] mx-6">
            <h2 className="text-xl font-bold text-white mb-4">{claim.planType || 'N/A'}</h2>
            <div className='flex gap-4 w-full'>
              <div className='flex flex-col px-4 w-full py-2 rounded-[5px] bg-white space-y-2'>
                <p className="text-sm font-medium">Policy start Date</p>
                <p className='font-semibold'>{claim.policyStartDate || 'N/A'}</p>
              </div>
              <div className='flex flex-col px-4 py-2 w-full rounded-[10px] bg-white space-y-2'>
                <p className="text-sm font-medium">Policy Expiry Date</p>
                <p className='font-semibold'>{claim.policyEndDate || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-[15px] w-full px-6">
          <div className='flex flex-col bg-[#E5E7EB80] px-6 py-4 rounded-[5px] w-full'>
            <span className="font-medium text-sm">Annual Coverage Limit</span>
            <span className="font-semibold">{claim.totalAmount || 'N/A'}</span>
          </div>
          <div className='flex flex-col bg-[#E5E7EB80] px-6 py-4 rounded-[5px] w-full'>
            <span className="font-medium">Remaining Balance</span>
            <span className="font-semibold">₦{claim.totalAmount - (claim.amount || 0) ? (claim.totalAmount - (claim.amount || 0)).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A'}</span>
          </div>
          </div>
        </div>

        {/* Medical Details */}
        <div className='bg-white border border-[#D9D9D9] rounded-[10px] space-y-4 py-4'>
          <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 pb-4">
            <h3 className="text-lg font-semibold">Medical Details</h3>
          </div>

          <div className='bg-[#F973160D] text-[#F97316]'>
            <p className='uppercase font-medium'>Diagnosis</p>
            <p>{claim.notes || 'N/A'}</p>
          </div>

          {/* Notes/Diagnosis */}
          {claim.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mx-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Diagnosis</h3>
              <p className="text-amber-800 whitespace-pre-line">{claim.notes}</p>
            </div>
          )}

          {/* Treatment Description & Services Rendered */}
          {claim.treatment && claim.treatment.length > 0 && (
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
          )}
        </div>

        {/* Provider Information */}
        <div className="bg-white border border-[#D9D9D9] rounded-[10px]">
          <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Provider Information</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px]">
              <div className='flex flex-col'>
                <span className="font-medium">Hospital/Provider:</span>
                <span className="font-semibold">{claim.hospitalProvider}</span>
              </div>
              <div className='flex flex-col'>
                <span className="font-medium">User ID:</span>
                <span className="font-semibold">{claim.userId}</span>
              </div>
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
              <div key={`comment-${index}`} className="flex flex-col bg-[#E5E7EB4D] rounded-[5px] p-3">
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
              onClick={handleAddComment}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
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
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claimId) {
      setLoading(false);
      return;
    }

    const fetchClaim = async () => {
      setLoading(true);
      const claimData = await getClaim(claimId);
      setClaim(claimData);
      setLoading(false);
    };

    fetchClaim();
  }, [claimId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="p-4 mb-8 w-full lg:max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-base text-slate-700">Claim not found.</p>
          <Link
            href="/dashboard/superadmin/claims"
            className="mt-6 inline-flex rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
          >
            Back to claims
          </Link>
        </div>
      </div>
    );
  }

  return <ClaimDetailsModal claim={claim} isOpen={true} onClose={() => {}} />;
}