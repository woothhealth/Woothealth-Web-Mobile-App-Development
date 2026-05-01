'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaArrowLeft, FaEnvelope, FaDownload } from 'react-icons/fa';
import { mockPrescriptions, Prescription } from '../../mockPrescription';

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
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">Forward Prescription</h2>
        <p className="mt-3 text-sm text-slate-600">
          Enter the email address to forward prescription <strong>{prescription.id}</strong>
        </p>
        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleForward}
              disabled={isLoading}
              className="rounded-xl bg-[#49A5EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8] disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send'}
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
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Download Prescription</h2>

        {/* Prescription Header */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
          <div>
            <p className="text-xs font-medium text-gray-600">Prescription ID</p>
            <p className="text-sm font-semibold text-gray-900">{prescription.id}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(prescription.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Patient</p>
            <p className="text-sm font-semibold text-gray-900">{prescription.patient}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">HMO ID</p>
            <p className="text-sm font-semibold text-gray-900">{prescription.hmoId}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Doctor</p>
            <p className="text-sm font-semibold text-gray-900">{prescription.doctor}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Specialization</p>
            <p className="text-sm font-semibold text-gray-900">{prescription.specialization}</p>
          </div>
        </div>

        {/* Prescription Details */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Prescription Details</h3>
          <div className="space-y-3">
            {prescription.details.map((detail, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-3">
                <p className="font-medium text-gray-900">{detail.medicationName}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <p className="font-medium">Dosage:</p>
                    <p>{detail.dosage}</p>
                  </div>
                  <div>
                    <p className="font-medium">Frequency:</p>
                    <p>{detail.frequency}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duration:</p>
                    <p>{detail.duration}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quantity:</p>
                    <p>{detail.quantity}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-700">
                  <span className="font-medium">Instructions:</span> {detail.instructions}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Diagnosis</h3>
          <p className="text-sm text-gray-700 rounded-lg bg-gray-50 p-3">{prescription.diagnosis}</p>
        </div>

        {/* Download Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isLoading}
            className="rounded-xl bg-[#49A5EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8] disabled:opacity-50 flex items-center gap-2"
          >
            <FaDownload size={14} />
            {isLoading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescription Details</h1>
          <p className="mt-2 text-gray-600">ID: {prescription.id}</p>
        </div>
        <Link
          href="/dashboard/superadmin/prescription"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          <FaArrowLeft size={14} />
          Back
        </Link>
      </div>

      {/* Main Content */}
      <div className="rounded-3xl bg-white p-6 shadow-sm space-y-6">
        {/* First Grid - Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
          <div>
            <p className="text-xs font-medium text-gray-600">Prescription ID</p>
            <p className="text-lg font-semibold text-gray-900">{prescription.id}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Date of Service</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(prescription.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Patient</p>
            <p className="text-lg font-semibold text-gray-900">{prescription.patient}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">HMO ID</p>
            <p className="text-lg font-semibold text-gray-900">{prescription.hmoId}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Doctor</p>
            <p className="text-lg font-semibold text-gray-900">{prescription.doctor}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Specialization</p>
            <p className="text-lg font-semibold text-gray-900">{prescription.specialization}</p>
          </div>
        </div>

        {/* Second Grid - Status & Diagnosis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-blue-50 p-4">
          <div>
            <p className="text-xs font-medium text-gray-600">Status</p>
            <div className="mt-2">
              <span className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${getStatusColor(prescription.status)}`}>
                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Diagnosis</p>
            <p className="text-sm text-gray-900 mt-2 line-clamp-2">{prescription.diagnosis}</p>
          </div>
        </div>

        {/* Prescription Details - Columns */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prescription Details</h2>
          <div className="space-y-4">
            {prescription.details.map((detail, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 text-base">{detail.medicationName}</h3>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-600">Dosage</p>
                    <p className="text-gray-900">{detail.dosage}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Frequency</p>
                    <p className="text-gray-900">{detail.frequency}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Duration</p>
                    <p className="text-gray-900">{detail.duration}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600">Quantity</p>
                    <p className="text-gray-900">{detail.quantity}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-medium text-gray-600 text-sm">Instructions</p>
                  <p className="text-gray-900 text-sm">{detail.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Diagnosis */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Full Diagnosis</h2>
          <p className="text-gray-700 rounded-lg bg-gray-50 p-4">{prescription.diagnosis}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowForwardModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#49A5EF] px-6 py-3 text-white font-semibold hover:bg-[#3d8ed8] transition"
          >
            <FaEnvelope size={16} />
            Forward Prescription
          </button>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#49A5EF] px-6 py-3 text-[#49A5EF] font-semibold hover:bg-blue-50 transition"
          >
            <FaDownload size={16} />
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
