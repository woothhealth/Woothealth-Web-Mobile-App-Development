"use client";

import React, { useState, useEffect } from 'react';
import { MdSearch, MdMoreVert } from 'react-icons/md';
import { useProviderPA } from '@/lib/providerPA';
import type { PaCode } from '../../types';
import { FaE } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';

interface PaCodeTrackingTableProps {
  onViewDetails: (paCode: PaCode) => void;
}

const PaCodeTrackingTable: React.FC<PaCodeTrackingTableProps> = ({ onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filteredPaCodes, setFilteredPaCodes] = useState<PaCode[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data: paData, isLoading, isError, error } = useProviderPA();

  const all = Array.isArray(paData) ? (paData as PaCode[]) : [];

  // Load PA codes from provider API
  useEffect(() => {
    setIsLoadingLocal(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (paData && Array.isArray(paData)) {
      setFilteredPaCodes(paData as PaCode[]);
    } else if (!isLoading && !paData) {
      setFilteredPaCodes([]);
    }
  }, [paData, isLoading]);

  // Filter PA codes based on search and status
  useEffect(() => {
    const all = (paData && Array.isArray(paData) ? (paData as PaCode[]) : []);
    let filtered = all;

    // Filter by search term (patient name, hmoid, authorization code)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (paCode) =>
          paCode.patientName.toLowerCase().includes(term) ||
          paCode.hmoid.toLowerCase().includes(term) ||
          paCode.authorizationCode.toLowerCase().includes(term) ||
          paCode.careType.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((paCode) => paCode.status === filterStatus);
    }

    setFilteredPaCodes(filtered as PaCode[]);
  }, [searchTerm, filterStatus, paData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#10B9811A] text-[#10B981]';
      case 'under review':
        return 'bg-[#F59E0B1A] text-[#F59E0B]';
      case 'declined':
        return 'bg-[#EF44441A] text-[#EF4444]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-hidden space-y-6">
      {/* Header with Search and Filter */}
      <div className="w-[90%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by patient name, HMOID, PA code, or care type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="under review">Under Review</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#ffffff] rounded-[10px] shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D9D9D9] text-[18px]">
              <th className="px-6 py-4 text-left font-semibold">
                Date of Service
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                HMOID
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                PA Code
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Care Type
              </th>
              <th className="px-6 py-4 text-center font-semibold">
                Status
              </th>
              <th className="px-6 py-4 text-center font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoadingLocal ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600">Loading PA codes...</span>
                  </div>
                </td>
              </tr>
            ) : filteredPaCodes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {all.length === 0
                    ? 'No PA codes found.'
                    : 'No PA codes match your search or filter.'}
                </td>
              </tr>
            ) : (
              filteredPaCodes.map((paCode) => (
                <tr
                  key={paCode.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors text-[15px]"
                >
                  <td className="px-6 py-4">
                    {formatDate(paCode.dateOfService)}
                  </td>
                  <td className="px-6 py-4">
                    {paCode.hmoid}
                  </td>
                  <td className="px-6 py-4">
                    {paCode.authorizationCode}
                  </td>
                  <td className="px-6 py-4">
                    {paCode.careType}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        paCode.status
                      )}`}
                    >
                      {paCode.status.charAt(0).toUpperCase() + paCode.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === paCode.id ? null : paCode.id
                          )
                        }
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <MdMoreVert size={20} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === paCode.id && (
                        <div className="absolute right-0 mt-2 w-38 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                          <button
                            onClick={() => {
                              onViewDetails(paCode);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-lg"
                          >
                            <FaEye className="inline-block mr-2" />
                            View Details
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

      {/* Footer */}
          {filteredPaCodes.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Showing {filteredPaCodes.length} of {all.length} PA codes
        </div>
      )}
    </div>
  );
};

export default PaCodeTrackingTable;
