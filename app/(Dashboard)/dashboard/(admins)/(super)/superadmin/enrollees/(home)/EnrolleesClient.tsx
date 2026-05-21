'use client';

import { useState, useEffect, useMemo } from 'react';
import { LuUpload } from 'react-icons/lu';
import Link from 'next/link';
import { FaEllipsisV, FaEye, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { useAdminEnrollees } from '@/Components/AdminEnrolleesContext';

interface AdminEnrollee {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  enrollmentDate?: string;
  [key: string]: any;
}

const ITEMS_PER_PAGE = 20;

export default function EnrolleesClient() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [enrolleesData, setEnrolleesData] = useState<AdminEnrollee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEnrollee | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEnrollee, setNewEnrollee] = useState<Partial<AdminEnrollee>>({
    name: '',
    email: '',
    status: 'active',
    hmoId: '',
    plan: '',
    enrollmentDate: '',
    expiryDate: '',
    dependants: 0,
    benefitBalance: ''
  });

  // Dynamic data fetch logic commented out while working on UI
  const { enrollees, loading, error, refetch } = useAdminEnrollees();

  const headers = ['Name', 'HMO ID', 'Enrollment Date', 'Expiry Date', 'Dependants', 'Benefit Balance', 'Status', 'Action'];

  const statusColors: Record<string, string> = {
    'active': 'bg-[#D1FAE5] text-[#10B981]',
    'inactive': 'bg-[#FEE2E2] text-[#EF4444]'
  };

  useEffect(() => {
    if (enrollees?.data) {
      setEnrolleesData(enrollees.data);
    }
  }, [enrollees]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const filteredEnrollees = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return enrolleesData;
    return enrolleesData.filter((enrollee) =>
      [enrollee.name, enrollee.email, enrollee.hmoId, enrollee.status]
        .filter(Boolean)
        .some((field) => field?.toString().toLowerCase().includes(term))
    );
  }, [search, enrolleesData]);

  const totalPages = Math.max(1, Math.ceil(filteredEnrollees.length / ITEMS_PER_PAGE));

  const paginatedEnrollees = filteredEnrollees.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleDelete = (enrollee: AdminEnrollee) => {
    setDeleteTarget(enrollee);
    setShowDeleteModal(true);
    setOpenActionMenu(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/admin/enrollees/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete enrollee.');
      }

      setEnrolleesData((current) => current.filter((e) => e.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
      toast.success('Enrollee deleted successfully.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete enrollee.');
    }
  };

  const handleAddEnrollee = async () => {
    if (!newEnrollee.name?.trim() || !newEnrollee.email?.trim()) {
      toast.error('Please fill in both name and email.');
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/admin/enrollees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEnrollee),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.message || response.statusText || 'Failed to add enrollee.';
        throw new Error(message);
      }

      const created = await response.json().catch(() => null);
      const newItem: AdminEnrollee = {
        id: created?.id || `enrollee-${Date.now()}`,
        name: newEnrollee.name || '',
        email: newEnrollee.email || '',
        status: newEnrollee.status || 'active',
        hmoId: newEnrollee.hmoId || '',
        enrollmentDate: newEnrollee.enrollmentDate || '',
        plan: newEnrollee.plan || '',
        expiryDate: newEnrollee.expiryDate || '',
        dependants: newEnrollee.dependants ?? 0,
        benefitBalance: newEnrollee.benefitBalance || ''
      };

      setEnrolleesData((current) => [newItem, ...current]);
      setShowAddModal(false);
      setNewEnrollee({
        name: '',
        email: '',
        status: 'active',
        hmoId: '',
        enrollmentDate: '',
        plan: '',
        expiryDate: '',
        dependants: 0,
        benefitBalance: ''
      });
      toast.success('Enrollee added successfully.');
    } catch (err: any) {
      setApiError(err?.message || 'Failed to add enrollee.');
      toast.error(err?.message || 'Failed to add enrollee.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:p-4 md:pt-10 w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8 lg:w-[90%] lg:mx-auto">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#d7d9df]"
          />
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-[#49A5EF] text-white text-center px-4 py-2 rounded-[10px]"
          >
            Add Enrollee
          </button>
        </div>
        {loading && enrolleesData.length === 0 ? (
          <div className="overflow-x-auto custom-scrollbar pb-4 h-120 bg-[#ffffff] rounded-[10px]">
            <table className="min-w-full border border-gray-200 rounded-[10px] overflow-hidden">
              <tbody className='overflow-y-auto h-96'>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-3 border-b border-[#E5E7EB]">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className="text-red-500">{error}</p>
          </div>
        ) : apiError ? (
          <div className='flex justify-center h-64 mt-4'>
            <p className="text-red-500">{apiError}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar pb-4 max:h-120 bg-[#ffffff] rounded-[10px]">
              <table className="w-full overflow-hidden">
                <thead className="border-b border-[#D9D9D9]">
                  <tr className=''>
                    {headers.map((h) => (
                      <th key={h} className="text-left text-[17px] px-6 py-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='overflow-y-auto max:h-96'>
                  {!search ? (
                    <tr>
                      <td colSpan={headers.length} className="px-6 py-8 text-center text-slate-500">
                        Enter a search term to show matching enrollees.
                      </td>
                    </tr>
                  ) : paginatedEnrollees.length === 0 ? (
                    <tr>
                      <td colSpan={headers.length} className="px-6 py-8 text-center text-slate-500">
                        No enrollees match your search.
                      </td>
                    </tr>
                  ) : (
                    paginatedEnrollees.map((enrollee) => (
                      <tr key={enrollee.id} className="hover:bg-gray-50 text-[14px] text-[#000000] divide-y divide-[#D9D9D9]">
                        <td className="px-6 py-3">{enrollee.name}</td>
                        <td className="px-6 py-3">{enrollee.hmoId || '—'}</td>
                        <td className="px-6 py-3">{enrollee.enrollmentDate || '—'}</td>
                        <td className="px-6 py-3">{enrollee.expiryDate || '—'}</td>
                        <td className="px-6 py-3 text-center">{enrollee.dependants || 0}</td>
                        <td className="px-6 py-3">{enrollee.benefitBalance || '—'}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[enrollee.status || 'active'] || ''}`}>
                            {enrollee.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-3 border-b border-[#D9D9D9]">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setOpenActionMenu(openActionMenu === enrollee.id ? enrollee.id : null)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
                            >
                              <FaEllipsisV size={16} />
                            </button>
                            {openActionMenu === enrollee.id && (
                              <div className="absolute right-0 top-full z-10 mt-2 w-32 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                                <Link
                                  href={`/dashboard/superadmin/enrollees/view?id=${enrollee.id}`}
                                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                                  onClick={() => setOpenActionMenu(null)}
                                >
                                  <FaEye size={14} />
                                  View
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(enrollee)}
                                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-slate-50"
                                >
                                  <FaTrash size={14} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {search && totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`px-3 py-1 rounded-lg border ${
                      pNum === page ? 'bg-[#49A5EF] text-white' : 'bg-white text-black'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-[15px] bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Delete Enrollee</h2>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete <span className="font-medium">{deleteTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 rounded-2xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-2xl h-full md:h-fit rounded-[15px] bg-white p-4 md:p-6 shadow-xl overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Add Enrollee</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input
                  value={newEnrollee.name || ''}
                  onChange={(e) => setNewEnrollee((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  placeholder="Enter name"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  value={newEnrollee.email || ''}
                  onChange={(e) => setNewEnrollee((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  placeholder="Enter email"
                  type="email"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">HMO ID</span>
                <input
                  value={newEnrollee.hmoId || ''}
                  onChange={(e) => setNewEnrollee((prev) => ({ ...prev, hmoId: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  placeholder="Enter HMO ID"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Status</span>
                <select
                  value={newEnrollee.status}
                  onChange={(e) => setNewEnrollee((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Enrollment Date</span>
                <input
                  type="date"
                  value={newEnrollee.enrollmentDate || ''}
                  onChange={(e) => setNewEnrollee((prev) => ({ ...prev, enrollmentDate: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Expiry Date</span>
                <input
                  type="date"
                  value={newEnrollee.expiryDate || ''}
                  onChange={(e) => setNewEnrollee((prev) => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Dependants</span>
                <input
                  type="number"
                  min={0}
                  value={newEnrollee.dependants ?? 0}
                  onChange={(e) => setNewEnrollee((prev) => ({ ...prev, dependants: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Benefit Balance</span>
                <input
                  value={newEnrollee.benefitBalance || ''}
                  onChange={(e) => setNewEnrollee((prev) => ({ ...prev, benefitBalance: e.target.value }))}
                  className="w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
                  placeholder="$0.00"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-2xl border border-[#E5E7EB] px-5 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddEnrollee}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-2xl bg-[#49A5EF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLoading ? 'Saving...' : 'Save Enrollee'}
              </button>
            </div>
          </div>
        </div>
      )}

    <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
          margin-top: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #464646;
          border-radius: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #464646;
        }
      `}</style>
    </div>
  );
}