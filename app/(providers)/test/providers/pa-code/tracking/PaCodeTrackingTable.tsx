'use client';

import React, { useState, useEffect } from 'react';
import { MdSearch, MdMoreVert } from 'react-icons/md';
import { MOCK_PA_CODES } from '@/data/mockPaCodes';
import type { PaCode } from '../types';

interface PaCodeTrackingTableProps {
  onViewDetails: (paCode: PaCode) => void;
}

const PaCodeTrackingTable: React.FC<PaCodeTrackingTableProps> = ({ onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filteredPaCodes, setFilteredPaCodes] = useState<PaCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Load PA codes on mount from mock data
  useEffect(() => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      setTimeout(() => {
        setFilteredPaCodes(MOCK_PA_CODES as PaCode[]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to load PA codes:', error);
      setIsLoading(false);
    }
  }, []);

  // Filter PA codes based on search and status
  useEffect(() => {
    let filtered = MOCK_PA_CODES;

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
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with Search and Filter */}
      <div className="p-6 border-b border-gray-200">
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Date of Service
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                HMOID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                PA Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Care Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
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
                  {MOCK_PA_CODES.length === 0
                    ? 'No PA codes found.'
                    : 'No PA codes match your search or filter.'}
                </td>
              </tr>
            ) : (
              filteredPaCodes.map((paCode) => (
                <tr
                  key={paCode.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(paCode.dateOfService)}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {paCode.hmoid}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {paCode.authorizationCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {paCode.careType}
                  </td>
                  <td className="px-6 py-4 text-sm">
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
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                          <button
                            onClick={() => {
                              onViewDetails(paCode);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-lg"
                          >
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
          Showing {filteredPaCodes.length} of {MOCK_PA_CODES.length} PA codes
        </div>
      )}
    </div>
  );
};

export default PaCodeTrackingTable;
