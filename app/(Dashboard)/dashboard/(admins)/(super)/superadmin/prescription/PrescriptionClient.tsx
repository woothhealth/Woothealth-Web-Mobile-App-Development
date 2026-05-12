'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaSearch, FaEllipsisV, FaEye, FaTrash } from 'react-icons/fa';
import { Prescription, mockPrescriptions } from './mockPrescription';
import DeleteConfirmModal from '../DeleteConfirmModal';

const ROWS_PER_PAGE = 10;

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

export default function PrescriptionClient() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'patient' | 'hmoId' | 'doctor'>('patient');
  const [deleteTarget, setDeleteTarget] = useState<Prescription | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const categories = [
    { label: 'Patient', value: 'patient' },
    { label: 'HMO ID', value: 'hmoId' },
    { label: 'Doctor', value: 'doctor' },
  ];

  const filteredPrescriptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return prescriptions.filter((prescription) => {
      const matchesSearch =
        selectedCategory === 'patient'
          ? prescription.patient.toLowerCase().includes(query)
          : selectedCategory === 'hmoId'
          ? prescription.hmoId.toLowerCase().includes(query)
          : prescription.doctor.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [prescriptions, search, selectedCategory]);

  const paginatedPrescriptions = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredPrescriptions.slice(start, start + ROWS_PER_PAGE);
  }, [filteredPrescriptions, page]);

  const totalPages = Math.ceil(filteredPrescriptions.length / ROWS_PER_PAGE);
  const startIndex = (page - 1) * ROWS_PER_PAGE + 1;
  const endIndex = Math.min(page * ROWS_PER_PAGE, filteredPrescriptions.length);

  const handleDeletePrescription = (id: string) => {
    const prescription = prescriptions.find((p) => p.id === id);
    if (!prescription) return;
    setDeleteTarget(prescription);
    setOpenActionMenu(null);
  };

  const confirmDeletePrescription = () => {
    if (!deleteTarget) return;
    setPrescriptions((current) => current.filter((p) => p.id !== deleteTarget.id));
    toast.success(`Prescription ${deleteTarget.id} deleted successfully.`);
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 mb-8 w-full mx-auto">
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between z-10">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={`Search by ${selectedCategory}...`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
          />
        </div>

        <div className="relative w-40">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as any);
              setPage(1);
              setSearch('');
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar rounded-[10px] bg-white shadow-sm">
        <table className="w-full text-[17px]">
          <thead>
            <tr className="border-b border-[#D9D9D9]">
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Patient</th>
              <th className="px-4 py-3 text-left font-semibold">HMO ID</th>
              <th className="px-4 py-3 text-left font-semibold">Doctor</th>
              <th className="px-4 py-3 text-left font-semibold">Specialization</th>
              <th className="px-4 py-3 text-center font-semibold">Status</th>
              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPrescriptions.map((prescription) => (
              <tr key={prescription.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 whitespace-nowrap w-fit">
                  {new Date(prescription.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-gray-900">{prescription.patient}</td>
                <td className="px-4 py-3 text-gray-900">{prescription.hmoId}</td>
                <td className="px-4 py-3 text-gray-900">{prescription.doctor}</td>
                <td className="px-4 py-3 text-gray-900">{prescription.specialization}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(prescription.status)}`}>
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </span>
                </td>
                <td className="relative px-4 py-3">
                  <div className="flex justify-center">
                    <button
                      onClick={() =>
                        setOpenActionMenu(openActionMenu === prescription.id ? null : prescription.id)
                      }
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 outline-0"
                    >
                      <FaEllipsisV size={16} />
                    </button>
                  </div>

                  {/* Action Menu */}
                  {openActionMenu === prescription.id && (
                    <div className="absolute right-0 top-full z-20 mt-2 w-32 rounded-lg border border-gray-200 bg-white shadow-lg">
                      <Link
                        href={`/dashboard/superadmin/prescription/${prescription.id}`}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#49A5EF] hover:bg-gray-50"
                        onClick={() => setOpenActionMenu(null)}
                      >
                        <FaEye size={14} />
                        View
                      </Link>
                      <button
                        onClick={() => handleDeletePrescription(prescription.id)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-50 border-t border-gray-200"
                      >
                        <FaTrash size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredPrescriptions.length > 0 ? startIndex : 0}-{endIndex} of {filteredPrescriptions.length} prescriptions
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete prescription"
          description={`Are you sure you want to delete prescription ${deleteTarget.id} for ${deleteTarget.patient}? This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeletePrescription}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #00000032;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00000080;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e0e0e0;
        }
      `}</style>
    </div>
  );
}