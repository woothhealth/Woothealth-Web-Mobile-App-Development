'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaUserMd, FaFileAlt } from 'react-icons/fa';
import { getAdminUserById, type AdminUser } from '@/lib/adminUser';

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
  const [user, setUser] = useState<AdminUser | null>(null);

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

  useEffect(() => {
    if (!telemedicine) {
      setUser(null);
      return;
    }

    const linkedUserId = telemedicine.patientId;
    if (!linkedUserId) {
      setUser(null);
      return;
    }

    const loadUser = async () => {
      try {
        const userData = await getAdminUserById(linkedUserId);
        setUser(userData);
      } catch (err) {
        console.error('Error loading linked user:', err);
        setUser(null);
      }
    };

    loadUser();
  }, [telemedicine]);

  function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex space-x-2">
      <span className="">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
    );
  }

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-500"></div>
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
      <Link href="/dashboard/superadmin/telemedicine" className="inline-flex items-center p-2 rounded-full border border-border font-medium text-slate-700 hover:text-slate-900">
        <FaArrowLeft size={22} />
      </Link>

      <div className="mt-6 rounded-[15px] bg-white py-6 shadow-sm space-y-4 w-[80%]">
        <div className='flex justify-between px-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className="text-3xl font-semibold text-gray-900">{telemedicine.id}</h2>
            <div className='flex space-x-1 text-[15px]'>
              <p className="">Date of Service</p>
              <p className="">
                {formatDate(telemedicine.dateOfService)}
              </p>
            </div>
          </div>
          <div>
            <span className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${getStatusColor(telemedicine.status)}`}>
                {telemedicine.status.charAt(0).toUpperCase() + telemedicine.status.slice(1)}
              </span>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 px-6">
          {/* Left side - Main details */}
          <div className="">
            <DetailCard label="Patient" value={telemedicine.patient} />
            <DetailCard label="HMO ID" value={telemedicine.hmoId} />
            <DetailCard label="Doctor" value={telemedicine.doctor} />
            <DetailCard label="Specialization" value={telemedicine.specialization} />
            <DetailCard label="Duration" value={telemedicine.duration} />
            {/* <div className="rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
              <p className="text-sm text-slate-500">Patient</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{telemedicine.patient}</p>
              {user?.email && (
                <p className="mt-1 text-sm text-slate-600 truncate">{user.email}</p>
              )}
            </div> */}
          </div>

          {/* Right side - Status and documents */}
          <div className="rounded-[10px] bg-[#E5E7EB4D] p-4">
            <p className="text-[15px] font-semibold">Supported Documents({telemedicine.supportedDocuments})</p>
            <div>
              {telemedicine.supportedDocuments > 0 ? (
                <div className="mt-2 flex items-center space-x-3 bg-primary/10 rounded-[5px] px-4 py-2 border border-primary">
                  <FaFileAlt size={20} className="text-gray-600" />
                  <p className="text-sm text-slate-600">
                    {telemedicine.supportedDocuments} document{telemedicine.supportedDocuments !== 1 ? 's' : ''}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No supported documents</p>
              )}
            </div>
          </div>
        </div>
          {/* Action buttons */}
            <div className="flex w-full space-x-4 px-6">
              <Link
                href={`/dashboard/superadmin/doctors/view?id=${telemedicine.doctorId}`}
                className="inline-flex items-center justify-center rounded-[15px] bg-[#49A5EF] px-6 py-3 w-full font-semibold text-white hover:bg-[#3d8ed8] gap-2"
              >
                <FaUserMd /> View Doctor Profile
              </Link>
              <Link
                href={`/dashboard/superadmin/users/view?id=${telemedicine.patientId}`}
                className="inline-flex items-center justify-center rounded-[15px] bg-[#10B981] px-6 py-3 w-full font-semibold text-white hover:bg-[#059669] gap-2"
              >
                <FaUser /> View Patient Profile
              </Link>
            </div>
      </div>
    </div>
  );
}