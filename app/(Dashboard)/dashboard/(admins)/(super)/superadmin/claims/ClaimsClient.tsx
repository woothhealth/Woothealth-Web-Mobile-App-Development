'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { FaEllipsisV, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { useAdminClaimsContext } from '@/Components/AdminClaimsContext';

type Claim = {
  id: string;
  dateOfService: string;
  userId: string;
  hospitalProvider: string;
  amount: number;
  userName: string;
  claimType: string;
  status: 'pending' | 'approved' | 'rejected';
  hmoId?: string;
};

const ITEMS_PER_PAGE = 20;

export default function ClaimsClient() {
  const { claims, loading, error } = useAdminClaimsContext();
  const [localClaims, setLocalClaims] = useState<Claim[]>(claims);
  const [deleteTarget, setDeleteTarget] = useState<Claim | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'patient'| 'userID' | 'provider' | 'status'>('patient');
  const [statusFilter, setStatusFilter] = useState<'all'|'pending'|'approved'|'rejected'|'paid'>('all');
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { label: 'Patient', value: 'patient' },
    { label: 'Provider', value: 'provider' },
    { label: 'Status', value: 'status' },
  ];

  const statuses = [
    { label: 'All Status', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Paid', value: 'paid' },
  ];

  const headers = ['Date of Service', 'Patient', 'HMO ID', 'Provider', 'Amount', 'Status', 'Action'];

  const filteredClaims = useMemo(() => {
    const q = search.toLowerCase();
    return localClaims.filter((claim: Claim) => {
      if (statusFilter !== 'all' && (claim.status || '').toLowerCase() !== statusFilter) return false;
      if (selectedCategory === 'patient') return (claim.userName || '').toLowerCase().includes(q);
      if (selectedCategory === 'provider') return claim.hospitalProvider.toLowerCase().includes(q);
      if (selectedCategory === 'status') return claim.status.toLowerCase().includes(q);
      return true;
    });
  }, [localClaims, search, selectedCategory, statusFilter]);

  const paginatedClaims = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredClaims.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClaims, page]);

  const totalPages = Math.ceil(filteredClaims.length / ITEMS_PER_PAGE);

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

  useEffect(() => {
    setLocalClaims(claims);
  }, [claims]);

  const handleDeleteClaim = (id: string) => {
    const claimToDelete = localClaims.find((claim) => claim.id === id);
    setLocalClaims((current) => current.filter((claim) => claim.id !== id));
    if (claimToDelete) {
      toast.success(`Claim for ${claimToDelete.userName ?? 'this patient'} deleted successfully.`);
    }
    setDeleteTarget(null);
    setOpenMenuId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading claims</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4 w-full">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-center w-full">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center md:w-[70%] w-full mx-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
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
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#49A5EF] w-full"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#ffffff] rounded-[10px] overflow-hidden">
        {/* Header */}
        <div className="hidden md:block">
          <table className="min-w-full table-fixed">
            <colgroup>
              <col style={{width: '15%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '20%'}} />
              <col style={{width: '15%'}} />
              <col style={{width: '10%'}} />
              <col style={{width: '10%'}} />
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading claims...</span>
                </div>
              </div>
            ) : paginatedClaims.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No claims found
              </div>
            ) : (
              <table className="min-w-full table-fixed">
                <thead className="border-b border-[#D9D9D9]">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="text-left md:text-[18px] px-4 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedClaims.map((claim: Claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50 text-[15px] md:text-base">
                      <td className="px-4 py-3 border-b border-[#E5E7EB] whitespace-nowrap w-fit">{formatDate(claim.dateOfService)}</td>
                      <td className="px-4 py-3 border-b border-[#E5E7EB] whitespace-nowrap w-fit">{claim.userName || 'N/A'}</td>
                      <td className="px-4 py-3 border-b border-[#E5E7EB] whitespace-nowrap w-fit">{claim.hmoId || 'N/A'}</td>
                      <td className="px-4 py-3 border-b border-[#E5E7EB] whitespace-nowrap w-fit">{claim.hospitalProvider}</td>
                      <td className="px-4 py-3 border-b border-[#E5E7EB] whitespace-nowrap w-fit">{formatCurrency(claim.amount)}</td>
                      <td className="px-4 py-3 border-b border-[#E5E7EB]">
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-[#E5E7EB] relative">
                        <Link
                          href={`/dashboard/superadmin/claims/${claim.id}`}
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <FaEye /> View
                        </Link>
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading claims...</span>
                </div>
              </div>
            ) : paginatedClaims.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No claims found
              </div>
            ) : (
              <table className='min-w-full table-fixed'>
                <colgroup>
                  <col style={{width: '15%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '20%'}} />
                  <col style={{width: '15%'}} />
                  <col style={{width: '10%'}} />
                  <col style={{width: '10%'}} />
                </colgroup>
                <tbody>
                  {paginatedClaims.map((claim: Claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50 text-[15px]">
                      <td className="px-6 py-2 border-b border-[#E5E7EB]">{formatDate(claim.dateOfService)}</td>
                      <td className="px-6 py-2 border-b border-[#E5E7EB]">{claim.userName || 'N/A'}</td>
                      <td className="px-6 py-2 border-b border-[#E5E7EB]">{claim.hmoId || 'N/A'}</td>
                      <td className="px-6 py-2 border-b border-[#E5E7EB]">{claim.hospitalProvider}</td>
                      <td className="px-6 py-2 border-b border-[#E5E7EB]">{formatCurrency(claim.amount)}</td>
                      <td className="px-6 py-2 border-b border-[#E5E7EB] text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-2 border-b border-[#E5E7EB] relative text-center">
                        <Link
                          href={`/dashboard/superadmin/claims/${claim.id}`}
                          rel="noreferrer"
                          className="flex items-center gap-1 px-2 py-0.5 text-xs text-[#ffffff] w-fit bg-primary/80 rounded-[5px] hover:bg-slate-100"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <FaEye /> View
                        </Link>                      </td>
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
          title="Delete claim"
          description={
            <>
              Are you sure you want to delete the claim for <strong>{deleteTarget.userName ?? 'this patient'}</strong>? This cannot be undone.
            </>
          }
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteClaim(deleteTarget.id)}
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