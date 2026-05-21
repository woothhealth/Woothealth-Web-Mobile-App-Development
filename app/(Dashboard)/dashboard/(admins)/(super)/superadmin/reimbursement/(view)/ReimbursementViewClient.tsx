'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaCommentDots } from 'react-icons/fa';
import { MOCK_REIMBURSEMENTS, Reimbursement } from '../(home)/mockReimbursements';

interface ReimbursementViewClientProps {
  reimbursementId: string;
}

async function getReimbursement(reimbursementId: string): Promise<Reimbursement | null> {
  try {
    const response = await fetch(`/api/admin/reimbursement?id=${encodeURIComponent(reimbursementId)}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      return MOCK_REIMBURSEMENTS.find((item) => item.id === reimbursementId || item.reimbursementId === reimbursementId) ?? null;
    }

    const data = await response.json();

    const findMatch = (items: any[]): Reimbursement | null => {
      const found = items.find((item) => item.id === reimbursementId || item.reimbursementId === reimbursementId);
      if (found) return found;
      return items.length === 1 ? items[0] : null;
    };

    if (data.success) {
      if (data.data && data.data.reimbursements && Array.isArray(data.data.reimbursements)) {
        const found = findMatch(data.data.reimbursements);
        if (found) return found;
      } else if (Array.isArray(data.data)) {
        const found = findMatch(data.data);
        if (found) return found;
      } else if (data.data && typeof data.data === 'object') {
        const claim = data.data as Reimbursement;
        if (claim.id === reimbursementId || claim.reimbursementId === reimbursementId) {
          return claim;
        }
      }
    }

    if (data.data && data.data.reimbursements && Array.isArray(data.data.reimbursements)) {
      const found = findMatch(data.data.reimbursements);
      if (found) return found;
    }

    if (Array.isArray(data)) {
      const found = findMatch(data);
      if (found) return found;
    }

    if (data && typeof data === 'object') {
      const claim = data as Reimbursement;
      if (claim.id === reimbursementId || claim.reimbursementId === reimbursementId) {
        return claim;
      }
    }

    return MOCK_REIMBURSEMENTS.find((item) => item.id === reimbursementId || item.reimbursementId === reimbursementId) ?? null;
  } catch (error) {
    return MOCK_REIMBURSEMENTS.find((item) => item.id === reimbursementId || item.reimbursementId === reimbursementId) ?? null;
  }
}

export default function ReimbursementViewClient({ reimbursementId }: ReimbursementViewClientProps) {
  const [reimbursement, setReimbursement] = useState<Reimbursement | null>(null);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [comment, setComment] = useState('');
  const [submittedComment, setSubmittedComment] = useState('');
  const [paCode, setPaCode] = useState<string>('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showCommentConfirm, setShowCommentConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const card = reimbursement;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleApprove = () => {
    const amount = approvedAmount ? Number(approvedAmount) : card?.amount || 0;
    const code = `PA-${Math.floor(100000 + Math.random() * 900000)}`;
    setApprovedAmount(amount.toString());
    setPaCode(code);
    setStatus('approved');
    setShowApproveConfirm(false);
  };

  const handleReject = () => {
    setStatus('rejected');
    setPaCode('');
    setApprovedAmount('');
    setShowRejectConfirm(false);
  };

  const handleAddComment = () => {
    setSubmittedComment(comment);
    setComment('');
    setShowCommentConfirm(false);
  };

  useEffect(() => {
    const loadReimbursement = async () => {
      setLoading(true);

      if (!reimbursementId) {
        setReimbursement(null);
        setLoading(false);
        return;
      }

      const data = await getReimbursement(reimbursementId);
      if (!data) {
        setReimbursement(null);
      } else {
        setReimbursement(data);
      }
      setLoading(false);
    };

    loadReimbursement();
  }, [reimbursementId]);

  useEffect(() => {
    if (!reimbursement) {
      setStatus('pending');
      setApprovedAmount('');
      setSubmittedComment('');
      setPaCode('');
      return;
    }

    setStatus(reimbursement.status || 'pending');
    setApprovedAmount(reimbursement.approvedAmount?.toString() ?? '');
    setSubmittedComment(reimbursement.comment || '');
    setPaCode(reimbursement.paCode || '');
  }, [reimbursement]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="p-6">
        <Link href="/dashboard/superadmin/reimbursement" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
          <FaArrowLeft /> Back to reimbursement
        </Link>
        <div className="mt-8 rounded-3xl border border-[#E5E7EB] bg-white p-8 text-center text-slate-700">
          <p className="text-lg font-semibold">Reimbursement not found</p>
          <p className="mt-2 text-sm text-slate-500">Please select a reimbursement from the list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-6 lg:py-6">
      <Link href="/dashboard/superadmin/reimbursement" className="inline-flex items-center gap-2 border border-border rounded-full p-2 font-medium hover:text-slate-900">
        <FaArrowLeft size={24} />
      </Link>

      <div className="mt-6 rounded-[15px] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{card.reimbursementId}</h1>
            <p>Submitted: {card.submittedDate}</p>
          </div>
          <div className={`text-sm px-4 rounded-[10px] py-1 ${getStatusColor(card.status)}`}>
            <span>{card.status}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className='flex flex-col space-y-1'>
          <div className="flex space-x-2">
            <p className="">Patient:</p>
            <p className="font-semibold">{card.patient}</p>
          </div>
          <div className="flex space-x-2">
            <p className="">HMO ID:</p>
            <p className="font-semibold">{card.hmoId}</p>
          </div>
          <div className="flex space-x-2">
            <p className="">Provider:</p>
            <p className="font-semibold">{card.provider}</p>
          </div>
          <div className="flex space-x-2">
            <p className="">Service:</p>
            <p className="font-semibold">{card.service}</p>
          </div>
          <div className="flex space-x-2">
            <p className="">Amount:</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{formatCurrency(card.amount)}</p>
              {status === 'approved' && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Paid</span>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-col space-y-3">
            {status === 'approved' ? (
              <div>
                <p className="text-xl">Approved Amount:</p>
                <p className="text-base font-semibold text-slate-900">
                  {formatCurrency(Number(approvedAmount) || card.amount)}
                </p>
              </div>
            ) : status === 'pending' && (
              <label className='flex flex-col'>
                <span className='text-xs text-slate-500'>Enter approved amount</span>
                <input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  placeholder='# 0,000.00'
                  className="w-40 rounded-[10px] border border-border px-4 py-3 text-slate-900 focus:border-[#49A5EF] focus:outline-none"
                />
              </label>
            )}
          </div>
          {status === 'approved' && (
            <div className="flex space-x-2">
              <p className="">PA Code:</p>
              <p className="font-semibold">{paCode}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <div className="rounded-[15px] bg-[#E5E7EB4D] p-4 space-y-4">
            <p className="text-sm text-slate-500">Supported Documents ({card.documentCount})</p>
            <div>
              <div className='w-full py-1 rounded-[10px] border border-primary bg-primmary/20 text-center'>Reciepts.jpg</div>
            </div>
          </div>
          <div className="rounded-[15px] bg-[#E5E7EB4D] p-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="w-full rounded-[5px] border border-border bg-[#ffffff] px-4 py-3 text-[15px] text-slate-800 focus:border-primary focus:outline-none resize-none"
              placeholder="Add a Comment"
            />
            {submittedComment && (
              <div className="rounded-[15px] p-4 border border-border space-y-2">
                <p className="font-semibold">Last comment</p>
                <p className="mt-2">{submittedComment}</p>
              </div>
            )}
          </div>
        </div>

        <div className="">
          {status === 'pending' ? (
            <div className="flex flex-col space-y-4">
              <button
                type="button"
                onClick={() => setShowApproveConfirm(true)}
                className="inline-flex items-center justify-center rounded-[10px] bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <FaCheckCircle className="mr-2" /> Approve
              </button>
              <button
                type="button"
                onClick={() => setShowRejectConfirm(true)}
                className="inline-flex items-center justify-center rounded-[10px] bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                <FaTimesCircle className="mr-2" /> Reject
              </button>
              <button
                type="button"
                onClick={() => setShowCommentConfirm(true)}
                className="inline-flex items-center justify-center rounded-[10px] border border-border bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                <FaCommentDots className="mr-2" /> Add Comment
              </button>
            </div>
          ) : status === 'approved' ? (
            <div className={`inline-flex items-center gap-3 rounded-[15px] px-5 py-2 text-sm font-semibold ${getStatusColor(status)}`}>
              <FaCheckCircle /> Approved
            </div>
          ) : (
            <div className={`inline-flex items-center gap-3 rounded-[15px] px-5 py-2 text-sm font-semibold ${getStatusColor(status)}`}>
              <FaTimesCircle /> Rejected
            </div>
          )}
        </div>
        </div>
      </div>

      {showApproveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full md:w-md rounded-[15px] bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Approve reimbursement</h2>
            <p className="mt-3 text-sm text-slate-600">
              Approving this reimbursement will set it to approved and generate a PA code.
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">Approved Amount</label>
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                placeholder={card.amount.toString()}
                className="mt-2 w-fit rounded-3xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-800 focus:border-[#49A5EF] focus:outline-none"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowApproveConfirm(false)}
                className="rounded-3xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="rounded-3xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Reject reimbursement</h2>
            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to reject this reimbursement request? No PA code will be generated.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRejectConfirm(false)}
                className="rounded-3xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Submit comment</h2>
            <p className="mt-3 text-sm text-slate-600">Would you like to attach this comment to the reimbursement?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCommentConfirm(false)}
                className="rounded-3xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddComment}
                className="rounded-3xl bg-[#49A5EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]"
              >
                Confirm Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
