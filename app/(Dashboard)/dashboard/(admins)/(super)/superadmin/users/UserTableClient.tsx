'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import CreateUserModal from './CreateModal';

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Suspended';
  dependants: number;
  hmoId: string;
  plan: string;
  address: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  coverStartDate: string;
  coverEndDate: string;
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  autoBillingEnabled: boolean;
};



export default function UserTableClient() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All status');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const totalFiltered = useMemo(() => {
    const query = search.trim().toLowerCase();

    let filtered = users;
    if (statusFilter !== 'All status') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    if (query) {
      filtered = filtered.filter((user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );
    }

    return filtered.length;
  }, [users, statusFilter, search]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    let filtered = users;
    if (statusFilter !== 'All status') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    if (query) {
      filtered = filtered.filter((user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query)
      );
    }

    const startIndex = (currentPage - 1) * 20;
    return filtered.slice(startIndex, startIndex + 20);
  }, [users, statusFilter, search, currentPage]);

  const fetchUsers = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      if (users.length === 0) {
        setLoading(true);
      }
      const response = await fetch('/api/admin/user', {
        credentials: 'include',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      
      // Check if data array exists (don't rely only on success flag)
      if (data && Array.isArray(data.data)) {
        // Transform API data to match UserProfile
        const transformedUsers: UserProfile[] = data.data.map((user: any) => ({
          id: user.userId || user.$id,
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phone: user.phone,
          status: user.status === 'active' ? 'Active' : 'Suspended',
          dependants: 0, // Not in API, default to 0
          hmoId: user.userId,
          role: user.role || 'User',
          plan: user.plan || 'N/A',
          address: '', // Not in API
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
          gender: user.gender === 'male' ? 'Male' : user.gender === 'female' ? 'Female' : 'Other',
          coverStartDate: '', // Not in API
          coverEndDate: '', // Not in API
          paymentFrequency: 'Monthly', // Default
          autoBillingEnabled: false, // Default
        }));
        setUsers(transformedUsers);
        setTotalUsers(data.total || transformedUsers.length);
      } else {
        throw new Error(data.message || 'Invalid response structure - missing data array');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch users once on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset page when search or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Update totalPages when filtered count changes
  useEffect(() => {
    setTotalPages(Math.ceil(totalFiltered / 20));
  }, [totalFiltered]);

  const statusColors: Record<string, string> = {
    Active: 'bg-[#D1FAE5] text-[#10B981]',
    Suspended: 'bg-[#FEF3C7] text-[#F59E0B]',
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-0 space-x-0 md:space-x-8 md:flex-row md:items-center md:justify-between">
          <div className="w-full">
            <div className="h-12 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
          <div>
            <div className="h-12 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[15px] bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-[15px]">
            <thead className=" text-[18px] font-semibold">
              <tr>
                <th className="px-4 py-4 text-left">Name</th>
                <th className="px-4 py-4 text-left">Email</th>
                <th className="px-4 py-4 text-left">Phone</th>
                <th className="px-4 py-4 text-left">Role</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-4 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="transition">
                  <td className="px-4 py-4">
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse mx-auto"></div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse mx-auto"></div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse mx-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
          <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center items-center h-44 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:space-y-0 space-x-0 md:space-x-6 md:flex-row md:items-center md:justify-between">
        <div className="w-full">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Name, Email, Phone, Status"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="All status">All status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}          className="inline-flex items-center w-fit md:w-40 rounded-[15px] bg-primary px-4 py-2 font-medium text-white shadow hover:bg-primary/90 transition"
        >
          Create User
        </button>
      </div>

      <div className="overflow-x-auto rounded-[10px] bg-white shadow-sm px-2 md:px-0 custom-scrollbar">
        <table className="min-w-full divide-y divide-slate-200 text-[15px]">
          <thead className=" text-[18px] font-semibold">
            <tr>
              <th className="px-4 py-4 text-left">Name</th>
              <th className="px-4 py-4 text-left">Email</th>
              <th className="px-4 py-4 text-left">Phone Number</th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-4 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {!search ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  Enter a search term to view users
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No users match your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-2 md:py-4 whitespace-nowrap w-fit capitalize">{user.fullName}</td>
                  <td className="px-4 py-2 md:py-4">{user.email}</td>
                  <td className="px-4 py-2 md:py-4 whitespace-nowrap w-fit">{user.phone}</td>
                  <td className={`px-4 py-2 md:py-4 text-center`}>
                    <span className={`${statusColors[user.status] || 'bg-gray-100 text-gray-800'} inline-flex items-center rounded-full px-3 py-1 text-xs font-medium   `}>
                        {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 md:py-4 text-center">
                    <Link href={`/dashboard/superadmin/users/${user.id}`}
                      className="inline-flex rounded-lg bg-[#49A5EF1A] px-3 py-2 text-xs font-medium text-[#49A5EF] transition hover:bg-blue-100"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
        <div className="text-sm text-slate-700">
          Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalFiltered)} of {totalFiltered} users
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm font-medium text-slate-900">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="px-3 py-1 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

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

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={() => fetchUsers()}
      />
    </div>
  );
}
