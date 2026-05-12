'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaArrowLeft, FaDownload, FaTimes } from 'react-icons/fa';
import { mockPrescriptions, Prescription } from '../mockPrescription';
import { CgMailForward } from 'react-icons/cg';
import { MdOutlineFileDownload } from 'react-icons/md';


const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#D1FAE5] text-[#10B981]';
      case 'pending':
        return 'bg-[#FEF3C7] text-[#F59E0B]';
      case 'denied':
        return 'bg-[#FEE2E2] text-[#EF4444]';
      default:
        return '';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

function ForwardModal({ prescription, onClose }: { prescription: Prescription; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForward = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    // Simulate sending
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Prescription ${prescription.id} forwarded to ${email} successfully.`);
      setEmail('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className='inset-0 absolute cursor-pointer' onClick={onClose}/>
      <div className="w-full max-w-md rounded-[10px] bg-white p-6 shadow-xl z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Forward Prescription</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Enter the email address to forward prescription <strong>{prescription.id}</strong>
        </p>
        <div className="mt-6 space-y-6">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
          />
          <div className="w-full">
            <button
              type="button"
              onClick={handleForward}
              disabled={isLoading}
              className="rounded-xl bg-[#49A5EF] px-4 py-2 text-sm w-full font-semibold text-white hover:bg-[#3d8ed8] disabled:opacity-50"
            >
              {isLoading ? 'Forwarding...' : 'Forward'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadModal({ prescription, onClose }: { prescription: Prescription; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    // Simulate PDF generation and download
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Prescription ${prescription.id} downloaded successfully.`);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className='inset-0 absolute cursor-pointer' onClick={onClose}/>
      <div className="w-full max-w-2xl rounded-[10px] bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto z-10 space-y-2">
        <div className='flex justify-between'>
          <div className='flex flex-col space-y-1'>
            <h2 className="text-2xl font-semibold text-gray-900">{prescription.id}</h2>
            <div className='flex space-x-1 text-xs'>
              <p className="">Date of Service</p>
              <p className="">
                {formatDate(prescription.date)}
              </p>
            </div>
          </div>
          <div>
            <span className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${getStatusColor(prescription.status)}`}>
                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
              </span>
          </div>
        </div>
        {/* Prescription Header */}
        <div className="flex flex-col divide-y divide-border text-[15px]">
          <div className='flex justify-between py-2'>
            <p className="">Patient</p>
            <p className="font-semibold">{prescription.patient}</p>
          </div>
          <div className='flex justify-between py-2'>
            <p className="">HMO ID</p>
            <p className="font-semibold">{prescription.hmoId}</p>
          </div>
          <div className='flex justify-between py-2'>
            <p className="">Doctor</p>
            <p className="font-semibold">{prescription.doctor}</p>
          </div>
          <div className='flex justify-between py-2'>
            <p className="">Specialization</p>
            <p className="font-semibold">{prescription.specialization}</p>
          </div>
        </div>

        {/* Prescription Details */}
        <div className="space-y-3">
          <h3 className="text-[15px] font-semibold">Prescription Details</h3>
          <div className="space-y-2 px-4">
            {prescription.details.map((detail, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 px-4 py-2 bg-[#E5E7EB4D] text-sm">
                <p className="font-medium text-gray-900">{detail.medicationName} ({detail.dosage})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="space-y-2 bg-[#E5E7EB4D] rounded-[10px] p-4">
          <h3 className="text-sm font-semibold text-gray-900">Diagnosis</h3>
          <p className="text-sm rounded-[5px] bg-[#ffffff] p-3">{prescription.diagnosis}</p>
        </div>

        {/* Download Button */}
        <div className="flex flex-col w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[15px] w-full border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isLoading}
            className="rounded-[15px] bg-primary w-full px-4 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <MdOutlineFileDownload size={22} />
            {isLoading ? 'Generating PDF...' : 'Download Prescription.pdf'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex space-x-2">
      <span className="">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default function PrescriptionViewPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;
  const prescription = id ? mockPrescriptions.find((p) => p.id === id) : undefined;
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  if (!prescription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600 mb-4">Prescription not found</p>
        <Link
          href="/dashboard/superadmin/prescription"
          className="flex items-center gap-2 rounded-lg bg-[#49A5EF] px-4 py-2 text-white hover:bg-[#3d8ed8]"
        >
          <FaArrowLeft size={14} />
          Back to Prescriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/superadmin/prescription"
          className="flex items-center gap-2 rounded-full border border-border p-2 text-gray-700 hover:bg-gray-50"
        >
          <FaArrowLeft size={22} />
        </Link>
      </div>

      {/* Main Content */}
      <div className="rounded-[15px] bg-white py-6 mb-6 shadow-sm space-y-6 w-[70%]">
        <div className='flex justify-between px-6'>
          <div className='flex flex-col space-y-1'>
            <h2 className="text-3xl font-semibold text-gray-900">{prescription.id}</h2>
            <div className='flex space-x-1'>
              <p className="">Date of Service</p>
              <p className="">
                {formatDate(prescription.date)}
              </p>
            </div>
          </div>
          <div>
            <span className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${getStatusColor(prescription.status)}`}>
                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
              </span>
          </div>
        </div>
        {/* First Grid - Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 border-b border-border pb-6 px-8">
          <div className='space-y-1'>
            <DetailCard label="Patient" value={prescription.patient} />
            <DetailCard label="HMO ID" value={prescription.hmoId} />
            <DetailCard label="Doctor" value={prescription.doctor} />
            <DetailCard label="Specialization" value={prescription.specialization} />
          </div>
          <div className='flex flex-col bg-[#E5E7EB4D] rounded-[10px] p-4 space-y-2'>
            <p className="font-semibold">Diagnosis for Prescription</p>
            <p className="text-sm bg-[#ffffff] border-border border rounded-[5px] p-4">{prescription.diagnosis}</p>
          </div>
        </div>

        {/* Prescription Details - Columns */}
        <div className='px-6 space-y-2'>
          <h2 className="text-xl font-semibold">Prescription Details</h2>
          <div className="space-y-4 px-2">
            {prescription.details.map((detail, idx) => (
              <div key={idx} className="rounded-[10px] bg-[#E5E7EB4D] px-4 py-2">
                <h3 className="">{detail.medicationName} ({detail.dosage})</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 px-6">
          <button
            onClick={() => setShowForwardModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-semibold hover:bg-[#3d8ed8] transition"
          >
            <CgMailForward size={16} />
            Forward Prescription
          </button>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-[#ffffff] bg-[#120052] font-semibold hover:bg-blue-50 transition"
          >
            <MdOutlineFileDownload size={16} />
            Download Prescription
          </button>
        </div>
      </div>

      {/* Modals */}
      {showForwardModal && (
        <ForwardModal
          prescription={prescription}
          onClose={() => setShowForwardModal(false)}
        />
      )}

      {showDownloadModal && (
        <DownloadModal
          prescription={prescription}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </div>
  );
}
