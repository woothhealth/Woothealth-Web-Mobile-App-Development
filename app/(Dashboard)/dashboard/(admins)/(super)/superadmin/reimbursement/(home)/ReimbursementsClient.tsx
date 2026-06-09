'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { Reimbursement } from './mockReimbursements';

const ITEMS_PER_PAGE = 15;

const normalizeReimbursement = (item: any): Reimbursement => ({
  id: item.id || item.$id || item.reimbursementId || item._id || '',
  reimbursementId: item.reimbursementId || item.reimbursement_id || item.id || item.$id || '',
  dateOfService: item.dateOfService || item.date_of_service || item.submittedDate || '',
  submittedDate: item.submittedDate || item.submitted_date || item.createdAt || '',
  patient: item.patient || item.patientName || item.fullName || '',
  hmoId: item.hmoId || item.hmo_id || item.userId || '',
  provider: item.provider || item.hospitalProvider || '',
  service: item.service || item.treatment || '',
  amount: typeof item.amount === 'string' ? Number(item.amount) : item.amount || 0,
  status: (item.status || 'pending').toLowerCase() as 'pending' | 'approved' | 'rejected',
  documentCount: item.documentCount ?? item.documents?.length ?? 0,
  approvedAmount: item.approvedAmount ?? item.approved_amount ?? undefined,
  paCode: item.paCode ?? item.pa_code ?? undefined,
  comment: item.comment ?? item.notes ?? item.reviewNotes ?? undefined,
});

const extractReimbursements = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.data && data.data.reimbursements && Array.isArray(data.data.reimbursements)) return data.data.reimbursements;
  return [];
};

export default function ReimbursementsClient() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'provider' | 'patient' | 'status'>('provider');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Reimbursement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Reimbursement | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editService, setEditService] = useState('');
  const [editStatus, setEditStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { label: 'Provider', value: 'provider' },
    { label: 'Patient', value: 'patient' },
    { label: 'Status', value: 'status' },
  ];

  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'] as const;

  const headers = ['Date of Service', 'Patient', 'HMO ID', 'Provider', 'Amount', 'Status', 'Action'];

  const fetchReimbursements = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/reimbursement', {
        cache: 'no-store',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reimbursements');
      }

      const data = await response.json();
      const list = extractReimbursements(data).map(normalizeReimbursement);
      setReimbursements(list);
    } catch (fetchError) {
      console.error('Error loading reimbursements:', fetchError);
      setError('Unable to load reimbursements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const filteredReimbursements = useMemo(() => {
    const query = search.toLowerCase();
    return reimbursements.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
      if (!matchesStatus) return false;

      if (selectedCategory === 'provider') {
        return item.provider.toLowerCase().includes(query);
      }
      if (selectedCategory === 'patient') {
        return item.patient.toLowerCase().includes(query);
      }
      if (selectedCategory === 'status') {
        return item.status.toLowerCase().includes(query);
      }

      return true;
    });
  }, [reimbursements, search, selectedCategory, statusFilter]);

  const paginatedReimbursements = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredReimbursements.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReimbursements, page]);

  const totalPages = Math.max(1, Math.ceil(filteredReimbursements.length / ITEMS_PER_PAGE));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(value);
  };

  const handleOpenEdit = (item: Reimbursement) => {
    setEditTarget(item);
    setEditAmount(item.amount.toString());
    setEditService(item.service);
    setEditStatus(item.status);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;

    const payload = {
      amount: Number(editAmount) || editTarget.amount,
      service: editService,
      status: editStatus,
    };

    try {
      const response = await fetch(`/api/admin/reimbursement?id=${encodeURIComponent(editTarget.id)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to save reimbursement');
      }

      const data = await response.json().catch(() => null);
      const updatedReimbursement = data?.data ? normalizeReimbursement(data.data) : { ...editTarget, ...payload };

      setReimbursements((prev) =>
        prev.map((item) => (item.id === editTarget.id ? { ...item, ...updatedReimbursement } : item))
      );
      toast.success('Reimbursement updated successfully.');
      setEditTarget(null);
    } catch (err) {
      console.error('Error saving reimbursement:', err);
      toast.error('Unable to save reimbursement. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch(`/api/admin/reimbursement?id=${encodeURIComponent(deleteTarget.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to delete reimbursement');
      }

      setReimbursements((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      toast.success(`Reimbursement for ${deleteTarget.patient} deleted successfully.`);
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting reimbursement:', err);
      toast.error('Unable to delete reimbursement. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center py-20">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#49A5EF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:w-[80%] mx-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={`Search ${selectedCategory}...`}
            className="min-w-70 rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm w-full focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="min-w-45 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-slate-700 focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-slate-700 focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[10px]  bg-white shadow-sm lg:w-[95%] mx-auto">
        <table className="min-w-full table-fixed">
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '8%' }} />
          </colgroup>
          <thead className="border-b border-[#D9D9D9]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-4 text-left text-base md:text-[17px] font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9D9D9] bg-white">
            {paginatedReimbursements.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-5 py-10 text-center text-slate-500">
                  No reimbursements match this search.
                </td>
              </tr>
            ) : (
              paginatedReimbursements.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-5 py-4 text-[14px] md:text-[15px]">{item.dateOfService}</td>
                  <td className="px-5 py-4 text-[14px] md:text-[15px]">{item.patient}</td>
                  <td className="px-5 py-4 text-[14px] md:text-[15px]">{item.hmoId}</td>
                  <td className="px-5 py-4 text-[14px] md:text-[15px]">{item.provider}</td>
                  <td className="px-5 py-4 text-[14px] md:text-[15px]">{formatCurrency(item.amount)}</td>
                  <td className="px-5 py-4 text-[14px] md:text-[15px] text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 relative text-[14px] md:text-[15px] text-center">
                    <Link
                      href={`/dashboard/superadmin/reimbursement/${item.reimbursementId}`}
                      className="flex w-full px-3 rounded-lg py-2 text-sm text-left text-slate-700 hover:bg-[#F8F9FA]"
                      onClick={() => setOpenMenuId(null)}
                    >
                      <FaEye className="mr-2 inline" /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-700">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-lg border border-[#E5E7EB] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-[#E5E7EB] px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Reimbursement</h2>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="text-slate-500 hover:text-slate-900"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Service</label>
                <input
                  type="text"
                  value={editService}
                  onChange={(e) => setEditService(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Amount</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 focus:border-[#49A5EF] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="rounded-xl bg-[#49A5EF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d8ed8]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Delete reimbursement</h2>
            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to delete <strong>{deleteTarget.patient}</strong>'s reimbursement record?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}