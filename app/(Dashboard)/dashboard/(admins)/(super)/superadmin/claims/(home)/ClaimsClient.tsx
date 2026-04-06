'use client';

import { useState, useEffect, useMemo } from 'react';
import { LuUpload } from 'react-icons/lu';
import Link from 'next/link';
import { useAdminClaimsContext } from '@/Components/AdminClaimsContext';

type Claim = {
  id: string;
  dateOfService: string;
  userId: string;
  hospitalProvider: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  patientName?: string;
  hmoId?: string;
};

const ITEMS_PER_PAGE = 20;

export default function ClaimsClient() {
  const { claims, loading, error } = useAdminClaimsContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'patient' | 'provider' | 'status'>('patient');
  const [page, setPage] = useState(1);

  const categories = [
    { label: 'Patient', value: 'patient' },
    { label: 'Provider', value: 'provider' },
    { label: 'Status', value: 'status' },
  ];

  const headers = ['Date of Service', 'Patient', 'HMO ID', 'Provider', 'Amount', 'Status', 'Action'];

  const filteredClaims = useMemo(() => {
    const q = search.toLowerCase();
    return claims.filter((claim: Claim) => {
      if (selectedCategory === 'patient') return (claim.patientName || '').toLowerCase().includes(q);
      if (selectedCategory === 'provider') return claim.hospitalProvider.toLowerCase().includes(q);
      if (selectedCategory === 'status') return claim.status.toLowerCase().includes(q);
      return true;
    });
  }, [claims, search, selectedCategory]);

  const paginatedClaims = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredClaims.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClaims, page]);

  const totalPages = Math.ceil(filteredClaims.length / ITEMS_PER_PAGE);

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
    <div className="space-y-4 py-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-center w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
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
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#49A5EF] min-w-[300px]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden md:w-[95%] mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-sm md:text-base font-medium bg-[#49A5EF] text-[#ffffff] uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Loading claims...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedClaims.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
                    No claims found
                  </td>
                </tr>
              ) : (
                paginatedClaims.map((claim: Claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(claim.dateOfService)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {claim.patientName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {claim.hmoId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {claim.hospitalProvider}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(claim.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/superadmin/claims/${claim.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/superadmin/claims/${claim.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, filteredClaims.length)} of {filteredClaims.length} claims
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}