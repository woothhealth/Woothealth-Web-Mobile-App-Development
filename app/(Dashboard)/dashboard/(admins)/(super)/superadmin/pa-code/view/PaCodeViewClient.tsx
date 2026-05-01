'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaCommentDots } from 'react-icons/fa';

type PaCode = {
  authorizationCode: string;
  policyNumber: string;
  diagnosis: string;
  providerName: string;
  createdDate: string;
  source: string;
  patientId: string;
  providerId: string;
  providerTier: string;
  patientPlan: string;
  patientsBenefits: any[];
  status: 'approved' | 'under review' | 'declined';
  bookingId: string;
  $id: string;
};

interface PaCodeViewClientProps {
  paCodeId: string;
}

async function getPaCode(paCodeId: string): Promise<PaCode | null> {
  const res = await fetch(`/api/admin/pa-codes?paCodeId=${paCodeId}`, { cache: 'no-store' });
  if (!res.ok) return null;

  const data = await res.json();

  let paCode: any = null;

  // Handle the admin/pa-codes response format
  if (data?.data) {
    paCode = data.data;
  } else if (data) {
    paCode = data;
  }

  return paCode;
}

export default function PaCodeViewClient({ paCodeId }: PaCodeViewClientProps) {
  const [paCode, setPaCode] = useState<PaCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'approved' | 'under review' | 'declined'>('under review');
  const [comment, setComment] = useState('');
  const [submittedComment, setSubmittedComment] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [showCommentConfirm, setShowCommentConfirm] = useState(false);

  useEffect(() => {
    const loadPaCode = async () => {
      setLoading(true);
      try {
        const data = await getPaCode(paCodeId);
        if (data) {
          setPaCode(data);
          setStatus(data.status);
        }
      } catch (err) {
        console.error('Failed to load pa-code:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPaCode();
  }, [paCodeId]);

  const handleApprove = () => {
    setStatus('approved');
    setShowApproveConfirm(false);
  };

  const handleDecline = () => {
    setStatus('declined');
    setShowDeclineConfirm(false);
  };

  const handleAddComment = () => {
    setSubmittedComment(comment);
    setComment('');
    setShowCommentConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading PA code...</span>
      </div>
    );
  }

  if (!paCode) {
    return (
      <div className="p-6">
        <Link href="/dashboard/superadmin/pa-code" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
          <FaArrowLeft /> Back to PA codes
        </Link>
        <div className="mt-8 rounded-3xl border border-[#E5E7EB] bg-white p-8 text-center text-slate-700">
          <p className="text-lg font-semibold">PA Code not found</p>
          <p className="mt-2 text-sm text-slate-500">Please select a PA code from the list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <Link href="/dashboard/superadmin/pa-code" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
        <FaArrowLeft /> Back to PA codes
      </Link>

      <div className="mt-6 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">PA Code</p>
            <h1 className="text-2xl font-semibold text-slate-900">{paCode.authorizationCode}</h1>
          </div>
          <div className="text-sm text-slate-500">Created: {formatDate(paCode.createdDate)}</div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Patient ID</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{paCode.patientId}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Provider</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{paCode.providerName}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Provider Tier</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{paCode.providerTier}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Source</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{paCode.source}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Booking ID</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{paCode.bookingId}</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
            <p className="text-sm text-slate-500">Policy Number</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{paCode.policyNumber || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
          <p className="text-sm text-slate-500">Diagnosis/Tariff Details</p>
          <p className="mt-2 text-base font-semibold text-slate-900 whitespace-pre-line">{paCode.diagnosis}</p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <p className="text-sm text-slate-500">Patient Benefits</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{paCode.patientsBenefits?.length || 0}</p>
            <p className="mt-2 text-sm text-slate-500">Total benefits covered</p>
          </div>
          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <label className="text-sm font-medium text-slate-700">Leave a comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="mt-3 w-full rounded-3xl border border-[#E5E7EB] px-4 py-3 text-sm text-slate-800 focus:border-[#49A5EF] focus:outline-none"
              placeholder="Enter comment for this PA code"
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
          {status === 'under review' ? (
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
                onClick={() => setShowDeclineConfirm(true)}
                className="inline-flex items-center justify-center rounded-3xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                <FaTimesCircle className="mr-2" /> Decline
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
              <FaTimesCircle /> Declined
            </div>
          )}
        </div>
      </div>

      {showApproveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Approve PA Code</h2>
            <p className="mt-3 text-sm text-slate-600">
              Approving this PA code will authorize the requested services.
            </p>
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

      {showDeclineConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Decline PA Code</h2>
            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to decline this PA code request?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeclineConfirm(false)}
                className="rounded-3xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="rounded-3xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {showCommentConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Submit comment</h2>
            <p className="mt-3 text-sm text-slate-600">Would you like to attach this comment to the PA code?</p>
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