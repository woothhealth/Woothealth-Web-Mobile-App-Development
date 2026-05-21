'use client';

import React, { useState, useEffect } from 'react';
import { MdSearch, MdMoreVert } from 'react-icons/md';
import { MOCK_ENROLLEES } from '@/data/mockEnrollees';
import { FaEye } from 'react-icons/fa';
import { Enrollee } from './page';

interface EnrolleesTableProps {
  enrollees: Enrollee[];
  onViewEnrollee: (enrollee: Enrollee) => void;
  onLoadEnrollees: (enrollees: Enrollee[]) => void;
}

const EnrolleesTable: React.FC<EnrolleesTableProps> = ({
  enrollees,
  onViewEnrollee,
  onLoadEnrollees,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filteredEnrollees, setFilteredEnrollees] = useState<Enrollee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Load enrollees on mount from mock data
  useEffect(() => {
    setIsLoading(true);
    try {
      onLoadEnrollees(MOCK_ENROLLEES as Enrollee[]);
    } catch (error) {
      console.error('Failed to load enrollees:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onLoadEnrollees]);

  // Filter enrollees based on search and status
  useEffect(() => {
    let filtered = enrollees;

    // Filter by search term (name, hmoid, plan)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (enrollee) =>
          enrollee.firstName.toLowerCase().includes(term) ||
          enrollee.lastName.toLowerCase().includes(term) ||
          enrollee.hmoid.toLowerCase().includes(term) ||
          enrollee.plan.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((enrollee) => enrollee.status === filterStatus);
    }

    setFilteredEnrollees(filtered);
  }, [searchTerm, filterStatus, enrollees]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#D1FAE5] text-[#10B981]';
      case 'inactive':
        return 'bg-[#EF44441A] text-[#EF4444]';
      case 'expired':
        return 'bg-[#F59E0B1A] text-[#F59E0B]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-hidden space-y-4">
      {/* Header with Search and Filter */}
      <div className="">
        <div className="flex justify-between items-center gap-4 w-[90%] mx-auto">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by name, HMOID, or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A5EF] focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A5EF] focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#ffffff] rounded-[15px] shadow-sm">
        <table className="w-full">
          <thead>
            <tr className='border-b border-[#D9D9D9] text-base'>
              <th className="px-6 py-4 text-left font-semibold">
                S/N
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                HMOID
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Name
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Plan
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Status
              </th>
              <th className="px-6 py-4 text-center font-semibold">
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
                    <span className="text-gray-600">Loading enrollees...</span>
                  </div>
                </td>
              </tr>
            ) : filteredEnrollees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {enrollees.length === 0
                    ? 'No enrollees found. Try adding some.'
                    : 'No enrollees match your search or filter.'}
                </td>
              </tr>
            ) : (
              filteredEnrollees.map((enrollee, index) => (
                <tr
                  key={enrollee.id}
                  className="divide-y divide-[#D9D9D9] hover:bg-gray-50 transition-colors text-[15px]"
                >
                  <td className="px-6 py-4  text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4  font-mono text-gray-900">
                    {enrollee.hmoid}
                  </td>
                  <td className="px-6 py-4  text-gray-900">
                    {enrollee.firstName} {enrollee.lastName}
                  </td>
                  <td className="px-6 py-4  text-gray-900">
                    {enrollee.plan}
                  </td>
                  <td className="px-6 py-4 ">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        enrollee.status
                      )}`}
                    >
                      {enrollee.status.charAt(0).toUpperCase() +
                        enrollee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-b border-[#D9D9D9]">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === enrollee.id ? null : enrollee.id
                          )
                        }
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <MdMoreVert size={20} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === enrollee.id && (
                        <div className="absolute right-0 mt-2 w-36 py-2 bg-white rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              onViewEnrollee(enrollee);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors first:rounded-t-lg flex items-center gap-2"
                          >
                            <FaEye size={16}/>
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
      {enrollees.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Showing {filteredEnrollees.length} of {enrollees.length} enrollees
        </div>
      )}
    </div>
  );
};

export default EnrolleesTable;
