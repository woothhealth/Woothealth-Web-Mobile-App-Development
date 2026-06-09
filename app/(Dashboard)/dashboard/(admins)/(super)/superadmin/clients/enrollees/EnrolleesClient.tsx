 'use client';

import { useState, useMemo, useEffect } from 'react';
import { FaEdit, FaEllipsisV, FaChevronDown, FaTrash, FaTimes } from 'react-icons/fa';
import { useSearchParams, useParams } from 'next/navigation';
import type { Enrollee } from '../mock-clients';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

interface DeleteConfirmModalProps {
  enrollee: Enrollee | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ enrollee, onConfirm, onCancel }: DeleteConfirmModalProps) {
  if (!enrollee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Delete Enrollee</h2>

        <p className="mt-4 text-sm text-slate-600">
          Are you sure you want to delete <strong>{enrollee.firstName}</strong>? This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function EnrolleesClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<Enrollee | null>(null);
  const [editingEnrollee, setEditingEnrollee] = useState<Enrollee | null>(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', plan: '', dependents: 0 });
  const [enrollees, setEnrollees] = useState<Enrollee[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const params = useParams();
  const routeClientId = (params as any)?.clientId;
  const clientId = searchParams.get('clientId') || routeClientId || null;

  useEffect(() => {
    if (!clientId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/enrollees?businessId=${encodeURIComponent(clientId)}`, { credentials: 'include' });
        const json = await res.json().catch(() => null);
        const raw = json?.data || json;
        if (!mounted) return;

        // Normalize to array
        let list: any[] = [];
        if (Array.isArray(raw)) list = raw;
        else if (raw && Array.isArray(raw.enrollees)) list = raw.enrollees;
        else if (raw && Array.isArray(raw.data)) list = raw.data;

        // Filter explicitly by businessId to ensure only matching enrollees are shown.
        const filtered = list.filter((e) => String(e?.businessId) === String(clientId));

        // If no explicit businessId fields matched, also try common alternatives (clientId/client_id/ownerId)
        let finalList = filtered;
        if (finalList.length === 0 && list.length > 0) {
          finalList = list.filter((e) =>
            String(e?.clientId) === String(clientId) ||
            String(e?.client_id) === String(clientId) ||
            String(e?.ownerId) === String(clientId) ||
            String(e?.business) === String(clientId)
          );
        }

        setEnrollees(finalList as Enrollee[]);
        // eslint-disable-next-line no-console
        console.debug('EnrolleesClient fetched enrollees (filtered):', { clientId, fetched: list.length, shown: finalList.length });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch enrollees for client', clientId, err);
        setEnrollees([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [clientId]);
  const itemsPerPage = 10;

  const name = enrollees.find((e) => e.userId === clientId)?.firstName + ' ' + enrollees.find((e) => e.userId === clientId)?.lastName || 'Client';

  const filtered = useMemo(() => {
    return enrollees.filter((enrollee) => {
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlan = planFilter ? enrollee.plan === planFilter : true;
      return matchesSearch && matchesPlan;
    });
  }, [searchTerm, planFilter, enrollees]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnrollees = filtered.slice(startIndex, endIndex);

  const planOptions = ['Premium', 'Basic'];

  const handleDelete = (enrollee: Enrollee) => {
    setDeleteConfirm(enrollee);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setEnrollees(enrollees.filter((e) => e.userId !== deleteConfirm.userId));
      setDeleteConfirm(null);
    }
  };

  const openEditModal = (enrollee: Enrollee) => {
    setEditingEnrollee(enrollee);
    setEditForm({
      lastName: enrollee.lastName || '',
      firstName: enrollee.firstName || '',
      email: enrollee.email,
      plan: enrollee.plan,
      dependents: enrollee.dependents,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleEditSave = () => {
    if (!editingEnrollee) return;

    setEnrollees((prev) =>
      prev.map((enrollee) =>
        enrollee.userId === editingEnrollee.userId
          ? { ...enrollee, ...editForm, dependents: Number(editForm.dependents) }
          : enrollee
      )
    );
    setEditingEnrollee(null);
  };

  if (!clientId) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <Link href="/dashboard/superadmin/clients" className="border border-border rounded-full p-2 hover:bg-slate-50 flex w-fit">
        <MdArrowBack size={22} />
      </Link>
      {/* Search + Plan Filter */}
      <div className="flex flex-col gap-3 md:flex-row sm:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by firstName or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="relative min-w-52">
          <button
            onClick={() => setPlanDropdownOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-300 bg-white px-6 py-2 font-medium text-slate-700 shadow-sm hover:border-slate-400"
            aria-expanded={planDropdownOpen}
            aria-haspopup="listbox"
          >
          {planFilter || 'All'}
          <FaChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {planDropdownOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-[15px] border border-border bg-white shadow-xl">
              <button
                onClick={() => {
                  setPlanFilter(null);
                  setPlanDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
              >
                All Plans
              </button>
              {planOptions.map((plan) => (
                <button
                  key={plan}
                  onClick={() => {
                    setPlanFilter(plan);
                    setPlanDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-slate-50"
                >
                  {plan}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[15px] bg-white">
        <table className="w-full">
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-border text-[17px]">
              <th className="px-4 py-3 text-left font-semibold">Date Added</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Plan</th>
              <th className="px-4 py-3 text-center font-semibold">Number of Dependents</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    <span className="ml-2">Loading enrollees...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedEnrollees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-sm text-slate-500">
                  No enrollees found.
                </td>
              </tr>
            ) : (paginatedEnrollees.map((enrollee) => (
              <tr key={enrollee.userId} className="divide-y divide-border text-[15px]">
                <td className="px-4 py-3">{formatDate(enrollee.$createdAt! || 'N/A')}</td>
                <td className="px-4 py-3">{enrollee.firstName} {enrollee.lastName}</td>
                <td className="px-4 py-3">{enrollee.email || 'N/A'}</td>
                <td className="px-4 py-3">{enrollee.plan || 'N/A'}</td>
                <td className="px-4 py-3 text-center">{enrollee.dependents || '0'}</td>
                <td className="px-4 py-3 border-b border-border">
                  <div className="relative">
                  <button
                    onClick={() => setOpenActionMenu(openActionMenu === enrollee.userId ? null : enrollee.userId)}
                    className="p-2"
                    title="Actions"
                  >
                    <FaEllipsisV size={16} />
                  </button>

                  {openActionMenu === enrollee.userId && (
                    <div style={{ minWidth: 150 }} className="absolute right-0 top-10 z-20 overflow-hidden rounded-[15px] border border-border bg-white shadow-xl">
                      <button
                        onClick={() => {
                          openEditModal(enrollee);
                          setOpenActionMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <FaEdit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(enrollee);
                          setOpenActionMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-slate-50"
                      >
                        <FaTrash className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6">
        <p className="text-sm text-slate-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of {filtered.length} enrollees
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        enrollee={deleteConfirm}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      {editingEnrollee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6">
          <div onClick={() => setEditingEnrollee(null)} className="absolute inset-0 cursor-pointer" />
          <div className="w-full md:w-2xl rounded-[15px] bg-white p-6 shadow-2xl z-10 relative">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Edit Enrollee</h2>
              </div>
              <FaTimes
                size={20}
                onClick={() => setEditingEnrollee(null)}
                className="cursor-pointer"
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                First Name
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                Last Name
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                Email
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                Plan Type
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, planType: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                >
                  {planOptions.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                Dependents
                <input
                  type="number"
                  min={0}
                  value={editForm.dependents}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, dependents: Number(e.target.value) }))
                  }
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setEditingEnrollee(null)}
                className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <div
                onClick={handleEditSave}
                className="rounded-[15px] bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 cursor-pointer text-center"
              >
                Save Changes
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
