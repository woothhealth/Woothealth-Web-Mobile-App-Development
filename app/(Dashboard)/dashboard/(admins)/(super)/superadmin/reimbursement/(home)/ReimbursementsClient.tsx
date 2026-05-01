'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { MOCK_REIMBURSEMENTS, Reimbursement } from './mockReimbursements';

const ITEMS_PER_PAGE = 15;

export default function ReimbursementsClient() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>(MOCK_REIMBURSEMENTS);
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

  const categories = [
    { label: 'Provider', value: 'provider' },
    { label: 'Patient', value: 'patient' },
    { label: 'Status', value: 'status' },
  ];

  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'] as const;

  const headers = ['Date of Service', 'Patient', 'HMO ID', 'Provider', 'Amount', 'Status', 'Action'];

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

  const handleSaveEdit = () => {
    if (!editTarget) return;
    setReimbursements((prev) =>
      prev.map((item) =>
        item.id === editTarget.id
          ? {
              ...item,
              amount: Number(editAmount) || item.amount,
              service: editService,
              status: editStatus,
            }
          : item
      )
    );
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const deleted = deleteTarget;
    setReimbursements((prev) => prev.filter((item) => item.id !== deleted.id));
    setDeleteTarget(null);
    toast.success(`Reimbursement for ${deleted.patient} deleted successfully.`);
  };

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
            className="min-w-[280px] rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm w-full focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="min-w-[180px] rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm text-slate-700 focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
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
                <td colSpan={headers.length} className="px-5 py-10 text-center text-sm text-slate-500">
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
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] text-slate-600 hover:bg-[#F8F9FA]"
                    >
                      <FaEllipsisV />
                    </button>
                    {openMenuId === item.id && (
                      <div className="absolute right-0 top-10 z-20 w-40 rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-lg">
                        <Link
                          href={`/dashboard/superadmin/reimbursement/view?id=${item.id}`}
                          className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-[#F8F9FA]"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <FaEye className="mr-2 inline" /> View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-[#F8F9FA]"
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget(item);
                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
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
