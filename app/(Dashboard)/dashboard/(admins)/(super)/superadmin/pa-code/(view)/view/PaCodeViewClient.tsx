'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaCommentDots } from 'react-icons/fa';
import { mockPaCodeDetails, type PaCodeDetail } from '../../mockPaCodeDetails';
import Title from '../../../UIs/Title';

type PaCode = PaCodeDetail;

interface PaCodeViewClientProps {
  paCodeId: string;
}

async function getPaCode(paCodeId: string): Promise<PaCode | null> {
  if (!paCodeId) {
    return null;
  }

  const res = await fetch(`/api/admin/pa-codes?paCodeId=${encodeURIComponent(paCodeId)}`, { cache: 'no-store' });
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
    if (!paCodeId) {
      setLoading(false);
      return;
    }

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

  const statusColors = {
    approved: 'bg-green-50 text-green-800',
    'under review': 'bg-yellow-50 text-yellow-800',
    declined: 'bg-red-50 text-red-800'
  };

  const initials = useMemo(() => {
    if (!paCode) return '';
    const names = paCode.providerName.split(' ');
    return names.map(name => name[0]).join('').toUpperCase();
  }, [paCode]);

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
      <div className='flex space-x-2'>
        <Link href="/dashboard/superadmin/pa-code" className="p-2 rounded-full border-2 border-[#D9D9D9]">
          <FaArrowLeft size={22} />
        </Link>
        <Title title="PA Code Details" />
      </div>

      <div className="mt-6 space-y-4">
        <div className='space-y-4 bg-[#ffffff] border border-[#D9D9D9] rounded-[10px] py-6'>
        <div className='flex justify-between items-center border-b border-[#D9D9D9] pb-4 px-6'>
          <p className='text-base font-semibold'>Enrollee Information</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[paCode.status]}`}>
            {paCode.status}
          </span>
        </div>
            <div className='flex space-x-8 w-full px-6'>
              <div className="flex items-center text-2xl p-4 rounded-[5px] bg-[#E5E7EB]">
                {initials}
              </div>
              <div className='w-full'>
                <p className="text-xl">{paCode.patientName}</p>
                  <div className="w-full">
                    <table className='w-full'>
                      <thead>
                        <tr>
                          <th className="text-left text-sm uppercase font-medium py-1">Patient ID</th>
                          <th className="text-left text-sm uppercase font-medium py-1">Email Address</th>
                          <th className="text-left text-sm uppercase font-medium py-1">Plan</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="text-left text-xs text-slate-900">{paCode.patientId}</td>
                          <td className="text-left text-xs text-slate-900">{paCode.patientEmail}</td>
                          <td className="text-left text-xs text-slate-900">
                            <span className='px-4 py-1 bg-[#49A5EF] rounded-[5px] text-[#ffffff]'>{paCode.patientPlan}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              </div>
            </div>
        </div>

        <div className='space-y-4 bg-[#ffffff] border border-[#D9D9D9] rounded-[10px] py-6'>
        <div className='border-b border-[#D9D9D9] pb-4 px-6'>
          <p className='text-base font-semibold'>PA Code Identifiers</p>
        </div>
            <div className='flex flex-col space-x-8 w-full px-6'>
              <div className='w-full'>
                  <div className="w-full flex flex-col space-y-2">
                    <table className='w-full'>
                      <thead>
                        <tr>
                          <th className="text-left text-sm uppercase font-medium py-1">Pa code</th>
                          <th className="text-left text-sm uppercase font-medium py-1">Date of encounter</th>
                          <th className="text-left text-sm uppercase font-medium py-1">Assigned Agent</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="text-left text-base">{paCode.authorizationCode}</td>
                          <td className="text-left text-base text-slate-900">{formatDate(paCode.createdDate)}</td>
                          <td className="text-left text-base text-slate-900">
                            {paCode.assignedAgent ? ('Agent ' + paCode.assignedAgent) : 'Unassigned'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className='w-full'>
                      <thead>
                        <tr>
                          <th className="text-left text-sm uppercase font-medium py-1">Care type</th>
                          <th className="text-left text-sm uppercase font-medium py-1">Provider</th>
                          <th className="text-left text-sm uppercase font-medium py-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-left text-base">{paCode.careType || 'N/A'}</td>
                          <td className="text-left text-base">{paCode.providerName}</td>
                          <td className="text-left text-base"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              </div>
            </div>
        </div>

        <div className='space-y-4 bg-[#ffffff] border border-[#D9D9D9] rounded-[10px] py-6'>
        <div className='border-b border-[#D9D9D9] pb-4 px-6'>
          <p className='text-base font-semibold'>Medical Details</p>
        </div>
            <div className='flex flex-col space-x-8 w-full px-6 rounded-[10px] text-[#B57406] border border-[#B57406]'>
              <div className='w-full p-4'>
                  <div className="w-full flex flex-col space-y-2">
                    <p className='uppercase'>Diagnosis</p>
                    <p className="text-left text-base whitespace-pre-line">{paCode.diagnosis}</p>
                  </div>
              </div>
            </div>
            <div className='w-full px-6 mt-4 space-y-4'>
              <p className='font-semibold'>Treatment Description & Services Rendered</p>
              <div className='w-full px-2'>
                <table className='w-full'>
                  <thead>
                    <tr>
                      <th className="text-left text-sm uppercase font-medium py-1">Item code</th>
                      <th className="text-left text-sm uppercase font-medium py-1">Description</th>
                      <th className="text-left text-sm uppercase font-medium py-1">quantity</th>
                      <th className="text-left text-sm uppercase font-medium py-1">unit price</th>
                      <th className="text-left text-sm uppercase font-medium py-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-left text-base">{paCode.treatment?.[0]?.itemCode || 'N/A'}</td>
                      <td className="text-left text-base">{paCode.treatment?.[0]?.description || 'N/A'}</td>
                      <td className="text-left text-base">{paCode.treatment?.[0]?.quantity || 'N/A'}</td>
                      <td className="text-left text-base">{paCode.treatment?.[0]?.unitPrice || 'N/A'}</td>
                      <td className="text-left text-base">{paCode.treatment?.[0]?.Amount || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
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