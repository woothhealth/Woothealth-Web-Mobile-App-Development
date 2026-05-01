'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import DeleteConfirmModal from '../DeleteConfirmModal';

type Validation = {
  id: string;
  dateOfService: string;
  provider: string;
  patient: string;
  hmoId: string;
  status: 'approved' | 'declined' | 'pending';
};

const ITEMS_PER_PAGE = 20;

async function getValidations(): Promise<Validation[]> {
  const res = await fetch('/api/admin/validations?page=1&limit=20', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch validations');

  const data = await res.json();

  let validations: any[] = [];

  // Handle the admin/validations response format
  if (data?.data && Array.isArray(data.data)) {
    validations = data.data;
  }
  else if (Array.isArray(data)) {
    validations = data;
  }
  else {
    console.warn('Unexpected validations response structure:', data);
    return [];
  }

  if (!Array.isArray(validations) || validations.length === 0) {
    console.warn('No validations found in response');
    return [];
  }

  return validations.map((doc: any) => ({
    id: doc.id || doc.$id || Math.random().toString(),
    dateOfService: doc.dateOfService || '',
    provider: doc.provider || '',
    patient: doc.patient || '',
    hmoId: doc.hmoId || '',
    status: doc.status || 'pending',
  }));
}

export default function ValidationsClient() {
  const [validations, setValidations] = useState<Validation[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Validation | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'patient' | 'provider' | 'status'>('patient');
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const categories = [
    { label: 'Patient', value: 'patient' },
    { label: 'Provider', value: 'provider' },
    { label: 'Status', value: 'status' },
  ];

  const headers = ['Date of Service', 'Provider', 'Patient', 'HMO ID', 'Status', 'Action'];

  const filteredValidations = useMemo(() => {
    const q = search.toLowerCase();
    return validations.filter((validation: Validation) => {
      if (selectedCategory === 'patient') return validation.patient.toLowerCase().includes(q);
      if (selectedCategory === 'provider') return validation.provider.toLowerCase().includes(q);
      if (selectedCategory === 'status') return validation.status.toLowerCase().includes(q);
      return true;
    });
  }, [validations, search, selectedCategory]);

  const paginatedValidations = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredValidations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredValidations, page]);

  const totalPages = Math.ceil(filteredValidations.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteValidation = (id: string) => {
    const validationToDelete = validations.find((item) => item.id === id);
    setValidations((current) => current.filter((item) => item.id !== id));
    if (validationToDelete) {
      toast.success(`Validation for ${validationToDelete.patient} deleted successfully.`);
    }
    setDeleteTarget(null);
    setOpenMenuId(null);
  };

  useEffect(() => {
    const loadValidations = async () => {
      setLoading(true);
      try {
        const data = await getValidations();
        setValidations(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load validations.');
      } finally {
        setLoading(false);
      }
    };

    loadValidations();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'declined': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading validations</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4 w-full px-2 md:px-0">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-center w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center md:w-[60%] md:mx-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder={`Search by ${selectedCategory}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#49A5EF] w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[10px] overflow-hidden md:w-[95%] mx-auto bg-[#ffffff] shadow-sm">
        {/* Header */}
        <div className="hidden md:block">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col style={{width: '15%'}} />
              <col style={{width: '20%'}} />
              <col style={{width: '20%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '15%'}} />
            </colgroup>
            <thead className="border-b border-[#D9D9D9]">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="text-left text-[18px] px-6 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
        <div ref={tableRef} className='max-h-120 lg:max-h-96 overflow-y-auto custom-scrollbar'>
          {/* Mobile view */}
          <div className="md:hidden">
            {loading ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#49A5EF]"></div>
                  <span className="ml-2">Loading validations...</span>
                </div>
              </div>
            ) : paginatedValidations.length === 0 ? (
              <div className="p-4 text-center">
                No validations found
              </div>
            ) : (
              <table className="min-w-full table-fixed">
                <thead className="border-b border-[#D9D9D9]">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="text-left text-sm px-2 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedValidations.map((validation: Validation) => (
                    <tr key={validation.id} className="text-sm">
                      <td className="px-2 py-2 border-b border-[#E5E7EB]">{formatDate(validation.dateOfService)}</td>
                      <td className="px-2 py-2 border-b border-[#E5E7EB]">{validation.provider}</td>
                      <td className="px-2 py-2 border-b border-[#E5E7EB]">{validation.patient}</td>
                      <td className="px-2 py-2 border-b border-[#E5E7EB]">{validation.hmoId}</td>
                      <td className="px-2 py-2 border-b border-[#E5E7EB]">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(validation.status)}`}>
                          {validation.status.charAt(0).toUpperCase() + validation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-2 py-2 border-b border-[#E5E7EB] relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === validation.id ? null : validation.id)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <FaEllipsisV />
                        </button>
                        {openMenuId === validation.id && (
                          <div className="absolute right-0 mt-2 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                            <Link
                              href={`/dashboard/superadmin/validations/${validation.id}`}
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FaEye /> View
                            </Link>
                            <Link
                              href={`/dashboard/superadmin/validations/${validation.id}/edit`}
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FaEdit /> Edit
                            </Link>
                            <button
                              onClick={() => {
                                setDeleteTarget(validation);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Desktop view */}
          <div className="hidden md:block">
            {loading ? (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#49A5EF]"></div>
                  <span className="ml-2">Loading validations...</span>
                </div>
              </div>
            ) : paginatedValidations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No validations found
              </div>
            ) : (
              <table className='min-w-full table-fixed'>
                <colgroup>
                  <col style={{width: '15%'}} />
                  <col style={{width: '20%'}} />
                  <col style={{width: '20%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '15%'}} />
                </colgroup>
                <tbody>
                  {paginatedValidations.map((validation: Validation) => (
                    <tr key={validation.id} className="hover:bg-gray-50 text-[15px]">
                      <td className="px-6 py-3 border-b border-[#E5E7EB]">{formatDate(validation.dateOfService)}</td>
                      <td className="px-6 py-3 border-b border-[#E5E7EB]">{validation.provider}</td>
                      <td className="px-6 py-3 border-b border-[#E5E7EB]">{validation.patient}</td>
                      <td className="px-6 py-3 border-b border-[#E5E7EB]">{validation.hmoId}</td>
                      <td className="px-6 py-3 border-b border-[#E5E7EB]">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(validation.status)}`}>
                          {validation.status.charAt(0).toUpperCase() + validation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 border-b border-[#E5E7EB] relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === validation.id ? null : validation.id)}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <FaEllipsisV />
                        </button>
                        {openMenuId === validation.id && (
                          <div className="absolute right-0 mt-2 w-32 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                            <Link
                              href={`/dashboard/superadmin/validations/${validation.id}`}
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FaEye /> View
                            </Link>
                            <Link
                              href={`/dashboard/superadmin/validations/${validation.id}/edit`}
                              rel="noreferrer"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FaEdit /> Edit
                            </Link>
                            <button
                              onClick={() => {
                                setDeleteTarget(validation);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {deleteTarget && (
        <DeleteConfirmModal
          title="Delete validation"
          description={
            <>
              Are you sure you want to delete the validation for <strong>{deleteTarget.patient}</strong>? This action cannot be undone.
            </>
          }
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteValidation(deleteTarget.id)}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 lg:p-4 items-center gap-0.5 lg:gap-2 md:w-[90%] mx-auto">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          margin-top: 10px;
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