'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaCommentDots, FaRegEye, FaEyeSlash, FaRegEdit } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { mockPaCodeDetails, type PaCodeDetail } from '../../mockPaCodeDetails';
import { getAdminUserById, type AdminUser } from '@/lib/adminUser';
import Title from '../../../UIs/Title';

type PaCode = PaCodeDetail & {
  userId?: string;
  hmoId?: string;
};

interface PaCodeViewClientProps {
  paCodeId: string;
  treatmentId?: string;
  comment?: string;
}

async function getPaCode(paCodeId: string): Promise<PaCode | null> {
  if (!paCodeId) {
    return null;
  }

  try {
    const res = await fetch(`/api/admin/pa-codes?paCodeId=${encodeURIComponent(paCodeId)}`, { cache: 'no-store' });

    if (res.ok) {
      const data = await res.json();
      let paCode: any = null;

      // Handle the admin/pa-codes response format
      if (data?.data) {
        if (Array.isArray(data.data)) {
          paCode = data.data.find((item: any) => item.$id === paCodeId || item.id === paCodeId) || data.data[0];
        } else {
          paCode = data.data;
        }
      } else if (Array.isArray(data)) {
        paCode = data.find((item: any) => item.$id === paCodeId || item.id === paCodeId) || data[0];
      } else if (data) {
        paCode = data;
      }

      if (paCode) {
        return paCode;
      }
    }
  } catch (error) {
    console.error('💥 API call threw error:', error);
  }

  // Fallback to mock data
  const mockPaCodes = Object.values(mockPaCodeDetails);
  const paCode = mockPaCodes.find(p => p.$id === paCodeId);
  if (paCode) {
    return paCode;
  }

  console.error('❌ PA code not found in mock data for ID:', paCodeId);
  return null;
} 

export default function PaCodeViewClient({ paCodeId }: PaCodeViewClientProps) {
  const [paCode, setPaCode] = useState<PaCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'approved' | 'under review' | 'declined'>('under review');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [comment, setComment] = useState('');
  const [submittedComment, setSubmittedComment] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);
  const [showCommentConfirm, setShowCommentConfirm] = useState(false);
  const [isShowPaCode, setIsShowPaCode] = useState(false);

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
          setStatus(data.status || 'under review');
        }
      } catch (err) {
        console.error('💥 Error in loadPaCode:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPaCode();
  }, [paCodeId]);

  useEffect(() => {
    if (!paCode) {
      setUser(null);
      return;
    }

    const linkedUserId = paCode.patientId || paCode.userId || paCode.hmoId;
    if (!linkedUserId) {
      setUser(null);
      return;
    }

    const loadUser = async () => {
      try {
        const userData = await getAdminUserById(linkedUserId);
        setUser(userData);
      } catch (err) {
        console.error('Error loading linked admin user:', err);
        setUser(null);
      }
    };

    loadUser();
  }, [paCode]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#10B9811A] text-[#10B981]';
      case 'declined':
        return 'bg-[#EF44441A] text-[#EF4444]';
      case 'under review':
        return 'bg-[#F59E0B1A] text-[#F59E0B]';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const DetailCard = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col">
      <span className="uppercase text-[15px] font-medium ">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  const showPaCode = () => {
    setIsShowPaCode(!isShowPaCode);
  };

  const totalAmount = paCode?.treatment?.reduce((sum, item) => sum + (item.Amount || 0), 0) || 0;

  const statusColors = {
    approved: 'bg-green-50 text-green-800',
    'under review': 'bg-yellow-50 text-yellow-800',
    declined: 'bg-red-50 text-red-800'
  };

  const initials = useMemo(() => {
    if (!paCode || !paCode.patientName) return '';
    const names = paCode.patientName.split(' ');
    return names.map(name => name[0]).join('').toUpperCase();
  }, [paCode]);

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || paCode?.patientName || 'No Name'
    : paCode?.patientName || 'No Name';

  const visibleEmail = user?.email || paCode?.patientEmail || 'N/A';
  const visibleHmoId = user?.userId || user?.$id || paCode?.patientId || 'N/A';

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
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
    <div className="w-full py-4">
      {/* Back Button */}
      <div className='flex w-full mb-4 justify-between items-center'>
        <div className='flex items-center space-x-8'>
          <Link href="/dashboard/superadmin/pa-code"
            className="font-semibold p-2 rounded-full border border-border hover:bg-gray-100 flex items-center"
          >
            <IoIosArrowBack size={28} />
          </Link>
          <h3 className='text-xl font-semibold'>PA Code Details</h3>
        </div>
        <div>
          <div>
            {paCode.status === 'under review' && (
              <div className='flex gap-2 text-[15px]'>
                <button onClick={() => setShowApproveConfirm(true)} className='px-6 py-2 rounded-[5px] bg-[#10B981] text-white font-medium hover:bg-green-700 transition'>Approve</button>
                <button onClick={() => setShowDeclineConfirm(true)} className='px-6 py-2 rounded-[5px] bg-[#EF4444] text-white font-medium hover:bg-red-700 transition'>Reject</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-[2fr_.5fr] gap-4'>
        <div className='bg-[#ffffff] rounded-[10px] p-4 space-y-4'>

          {/* Enrollee Information */}
          <div className="space-y-4 py-2 shadow-sm border border-border rounded-[10px]">
            <div className="flex justify-between items-center border-b border-border px-6 pb-4">
              <h2 className='text-lg font-semibold'>Enrollee Information</h2>
              <div className={`px-6 py-2 rounded-full text-sm capitalize ${statusColors[paCode.status] || 'bg-gray-100 text-gray-800'}`}>
                {paCode.status}
              </div>
            </div>
            <div className="flex items-start space-x-4 px-6 py-4">
              {/* Avatar */}
              <div className="shrink-0 w-20 h-20 rounded-[10px] bg-linear-to-br from-blue-400 to-primary flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>

              <div className="flex-1 space-y-1">
                <h4 className="text-xl font-semibold text-gray-900">{displayName}</h4>
                <div className="grid grid-cols-4 gap-4 text-[15px]">
                  <div className='flex flex-col'>
                    <span className="font-medium">HMO ID</span>
                    <span className="font-semibold">{visibleHmoId}</span>
                  </div>
                  <div className='flex flex-col col-span-2'>
                    <span className="font-medium">Email</span>
                    <span className="w-20 font-semibold">{visibleEmail}</span>
                  </div>
                  <div className='flex flex-col'>
                    <span className="font-medium">Plan</span>
                    <span className="font-semibold bg-primary text-white px-3 py-1 text-sm rounded-[5px] w-fit">{paCode.patientPlan || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='border border-border rounded-[10px] space-y-6 shadow-sm py-2'>
            <h2 className='text-lg font-semibold px-6 pb-2 border-b border-border'>PA Code Identifiers</h2>
            <div className='px-6 py-2 space-y-4 grid grid-cols-1 md:grid-cols-3'>
                <DetailCard label="PA Code" value={paCode.authorizationCode || 'N/A'} />
                <DetailCard label=' Date of encounter' value={paCode.createdDate ? formatDate(paCode.createdDate) : 'N/A'} />
                <DetailCard label='Assigned Agent' value={paCode.assignedAgent || 'N/A'} />
                <DetailCard label='Care Type' value={paCode.careType || 'N/A'} />
                <DetailCard label='Provider' value={paCode.providerName || 'N/A'} />
            </div>
          </div>

          {/* Medical Details */}
          <div className='bg-white border border-[#D9D9D9] rounded-[10px] space-y-4 py-4'>
            <div className="flex justify-between items-center border-b border-[#D9D9D9] px-6 pb-4">
              <h3 className="text-lg font-semibold">Medical Details</h3>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mx-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Diagnosis</h3>
              <p className="text-amber-800 whitespace-pre-line">{paCode.diagnosis || 'N/A'}</p>
            </div>

            {/* Treatment Description & Services Rendered */}
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <h3 className="text-[17px] font-semibold text-gray-900 mb-4">Treatment Description & Services Rendered</h3>
              </div>
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
                    {paCode.treatment?.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-primary">{item.itemCode || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{item.description || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-center">{item.quantity || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">₦{item.unitPrice ? item.unitPrice.toFixed(2) : 'N/A'}</td>
                        <td className="px-4 py-3 text-sm font-semibold">₦{item.Amount ? item.Amount.toFixed(2) : 'N/A'}</td>
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
        </div>
      </div>
    </div>
  )
};