'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaCommentDots } from 'react-icons/fa';
import { MOCK_REIMBURSEMENTS, Reimbursement } from '../(home)/mockReimbursements';

interface ReimbursementViewClientProps {
  reimbursementId: string;
}

export default function ReimbursementViewClient({ reimbursementId }: ReimbursementViewClientProps) {
  const reimbursement = useMemo(
    () => MOCK_REIMBURSEMENTS.find((item) => item.id === reimbursementId),
    [reimbursementId]
  );

  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>(reimbursement?.status || 'pending');
  const [approvedAmount, setApprovedAmount] = useState<string>(reimbursement?.approvedAmount?.toString() ?? '');
  const [comment, setComment] = useState('');
  const [submittedComment, setSubmittedComment] = useState(reimbursement?.comment || '');
  const [paCode, setPaCode] = useState<string>(reimbursement?.paCode || '');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showCommentConfirm, setShowCommentConfirm] = useState(false);

  const card = reimbursement;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
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
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <Link href="/dashboard/superadmin/reimbursement" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
        <FaArrowLeft /> Back to reimbursement
      </Link>

      <div className="mt-6 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Reimbursement ID</p>
            <h1 className="text-2xl font-semibold text-slate-900">{card.reimbursementId}</h1>
          </div>
          <div className="text-sm text-slate-500">Submitted: {card.submittedDate}</div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Patient Name</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{card.patient}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">HMO ID</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{card.hmoId}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Provider</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{card.provider}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Service</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{card.service}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Amount</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-base font-semibold text-slate-900">{formatCurrency(card.amount)}</p>
              {status === 'approved' && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Paid</span>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Approved Amount</p>
            {status === 'approved' ? (
              <p className="mt-2 text-base font-semibold text-slate-900">
                {formatCurrency(Number(approvedAmount) || card.amount)}
              </p>
            ) : (
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                placeholder={card.amount.toString()}
                className="mt-2 w-full rounded-3xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-slate-900 focus:border-[#49A5EF] focus:outline-none"
              />
            )}
          </div>
          {status === 'approved' && (
            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 lg:col-span-3">
              <p className="text-sm text-slate-500">PA Code</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{paCode}</p>
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <p className="text-sm text-slate-500">Supported Documents</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{card.documentCount}</p>
            <p className="mt-2 text-sm text-slate-500">Total attached files</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <label className="text-sm font-medium text-slate-700">Leave a comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="mt-3 w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm text-slate-800 focus:border-[#49A5EF] focus:outline-none"
              placeholder="Enter comment for this reimbursement"
            />
            {submittedComment && (
              <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold">Last comment</p>
                <p className="mt-2">{submittedComment}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[#E5E7EB] bg-white p-6">
          {status === 'pending' ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <button
                type="button"
                onClick={() => setShowApproveConfirm(true)}
                className="inline-flex items-center justify-center rounded-3xl bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
              >
                <FaCheckCircle className="mr-2" /> Approve
              </button>
              <button
                type="button"
                onClick={() => setShowRejectConfirm(true)}
                className="inline-flex items-center justify-center rounded-3xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                <FaTimesCircle className="mr-2" /> Reject
              </button>
              <button
                type="button"
                onClick={() => setShowCommentConfirm(true)}
                className="inline-flex items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                <FaCommentDots className="mr-2" /> Add Comment
              </button>
            </div>
          ) : status === 'approved' ? (
            <div className="inline-flex items-center gap-3 rounded-3xl bg-green-50 px-5 py-4 text-sm font-semibold text-green-800">
              <FaCheckCircle /> Approved
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 rounded-3xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-800">
              <FaTimesCircle /> Rejected
            </div>
          )}
        </div>
      </div>

      {showApproveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Approve reimbursement</h2>
            <p className="mt-3 text-sm text-slate-600">
              Approving this reimbursement will set it to approved and generate a PA code for payment.
            </p>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700">Approved Amount</label>
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                placeholder={card.amount.toString()}
                className="mt-2 w-full rounded-3xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-800 focus:border-[#49A5EF] focus:outline-none"
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
