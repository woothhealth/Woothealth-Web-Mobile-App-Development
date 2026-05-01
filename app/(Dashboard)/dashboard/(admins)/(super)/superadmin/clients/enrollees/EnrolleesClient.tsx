'use client';

import { useState, useMemo } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { mockEnrollees } from '../mock-clients';
import type { Enrollee } from '../mock-clients';

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
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2">
            <span className="text-xl">⚠️</span>
          </div>
          <h2 className="text-lg font-semibold">Delete Enrollee</h2>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Are you sure you want to delete <strong>{enrollee.name}</strong>? This action cannot be undone.
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
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<Enrollee | null>(null);
  const [enrollees, setEnrollees] = useState(mockEnrollees);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    return enrollees.filter((enrollee) => {
      const matchesSearch =
        enrollee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollee.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, enrollees]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnrollees = filtered.slice(startIndex, endIndex);

  const handleDelete = (enrollee: Enrollee) => {
    setDeleteConfirm(enrollee);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      setEnrollees(enrollees.filter((e) => e.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (enrollee: Enrollee) => {
    alert(`Edit enrollee: ${enrollee.name}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Date Added</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Plan Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Dependents</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEnrollees.map((enrollee) => (
              <tr key={enrollee.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-3 text-sm text-slate-900">{enrollee.dateAdded}</td>
                <td className="px-6 py-3 text-sm font-medium text-slate-900">{enrollee.name}</td>
                <td className="px-6 py-3 text-sm text-slate-600">{enrollee.email}</td>
                <td className="px-6 py-3 text-sm">{enrollee.planType}</td>
                <td className="px-6 py-3 text-sm text-slate-900">{enrollee.dependents}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(enrollee)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(enrollee)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
    </div>
  );
}
