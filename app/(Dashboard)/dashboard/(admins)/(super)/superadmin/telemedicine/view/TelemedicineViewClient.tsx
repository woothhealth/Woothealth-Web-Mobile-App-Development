'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaUserMd, FaFileAlt } from 'react-icons/fa';

type Telemedicine = {
  id: string;
  telemedicineId: string;
  dateOfService: string;
  patient: string;
  hmoId: string;
  doctor: string;
  specialization: string;
  duration: string;
  status: 'completed' | 'ongoing' | 'scheduled';
  supportedDocuments: number;
  patientId: string;
  doctorId: string;
};

interface TelemedicineViewClientProps {
  telemedicineId: string;
}

async function getTelemedicine(telemedicineId: string): Promise<Telemedicine | null> {
  const res = await fetch(`/api/admin/telemedicine?telemedicineId=${telemedicineId}`, { cache: 'no-store' });
  if (!res.ok) return null;

  const data = await res.json();

  let telemedicine: any = null;

  // Handle the admin/telemedicine response format
  if (data?.data) {
    telemedicine = data.data;
  } else if (data) {
    telemedicine = data;
  }

  if (!telemedicine) return null;

  return {
    id: telemedicine.$id || telemedicine.id || telemedicineId,
    telemedicineId: telemedicine.telemedicineId || `TEL-${telemedicineId.slice(-6)}`,
    dateOfService: telemedicine.dateOfService || '',
    patient: telemedicine.patient || '',
    hmoId: telemedicine.hmoId || '',
    doctor: telemedicine.doctor || '',
    specialization: telemedicine.specialization || '',
    duration: telemedicine.duration || '',
    status: telemedicine.status || 'scheduled',
    supportedDocuments: telemedicine.supportedDocuments || 0,
    patientId: telemedicine.patientId || '',
    doctorId: telemedicine.doctorId || '',
  };
}

export default function TelemedicineViewClient({ telemedicineId }: TelemedicineViewClientProps) {
  const [telemedicine, setTelemedicine] = useState<Telemedicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTelemedicine = async () => {
      setLoading(true);
      try {
        const data = await getTelemedicine(telemedicineId);
        if (data) {
          setTelemedicine(data);
        }
      } catch (err) {
        console.error('Failed to load telemedicine:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTelemedicine();
  }, [telemedicineId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'ongoing': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading telemedicine...</span>
      </div>
    );
  }

  if (!telemedicine) {
    return (
      <div className="p-6">
        <Link href="/dashboard/superadmin/telemedicine" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
          <FaArrowLeft /> Back to telemedicine
        </Link>
        <div className="mt-8 rounded-3xl border border-[#E5E7EB] bg-white p-8 text-center text-slate-700">
          <p className="text-lg font-semibold">Telemedicine not found</p>
          <p className="mt-2 text-sm text-slate-500">Please select a telemedicine request from the list.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8">
      <Link href="/dashboard/superadmin/telemedicine" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900">
        <FaArrowLeft /> Back to telemedicine
      </Link>

      <div className="mt-6 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left side - Main details */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">Telemedicine ID</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{telemedicine.telemedicineId}</p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">Date & Time</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{formatDate(telemedicine.dateOfService)}</p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">Patient</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{telemedicine.patient}</p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">HMO ID</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{telemedicine.hmoId}</p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">Doctor</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{telemedicine.doctor}</p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">Specialization</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{telemedicine.specialization}</p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">Duration</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{telemedicine.duration}</p>
            </div>

            {/* Action buttons */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Link
                href={`/dashboard/superadmin/doctors/view?id=${telemedicine.doctorId}`}
                className="inline-flex items-center justify-center rounded-3xl bg-[#49A5EF] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3d8ed8] gap-2"
              >
                <FaUserMd /> View Doctor Profile
              </Link>
              <Link
                href={`/dashboard/superadmin/users/view?id=${telemedicine.patientId}`}
                className="inline-flex items-center justify-center rounded-3xl bg-[#10B981] px-6 py-3 text-sm font-semibold text-white hover:bg-[#059669] gap-2"
              >
                <FaUser /> View Patient Profile
              </Link>
            </div>
          </div>

          {/* Right side - Status and documents */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
              <p className="text-sm text-slate-500 mb-4">Status</p>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(telemedicine.status)}`}>
                  {telemedicine.status.charAt(0).toUpperCase() + telemedicine.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaFileAlt className="text-slate-500" />
                <p className="text-sm text-slate-500">Supported Documents</p>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{telemedicine.supportedDocuments}</p>
              <p className="mt-2 text-sm text-slate-500">Total attached files</p>
            </div>

            {/* Additional info can be added here */}
            <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">Session Details</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Type:</span>
                  <span className="font-medium">Video Consultation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Platform:</span>
                  <span className="font-medium">Secure Telemedicine Portal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recording:</span>
                  <span className="font-medium">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}