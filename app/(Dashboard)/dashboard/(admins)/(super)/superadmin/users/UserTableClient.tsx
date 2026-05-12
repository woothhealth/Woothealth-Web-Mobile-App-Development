'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';

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
  homeAddress: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  coverStartDate: string;
  coverEndDate: string;
  paymentFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  autoBillingEnabled: boolean;
};

type CreateUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  status: 'active' | 'suspended';
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
};

const CreateUserModal = ({ isOpen, onClose, onUserCreated }: {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}) => {
  const [formData, setFormData] = useState<CreateUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    status: 'active',
    gender: 'male',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const result = await response.json();
      onUserCreated();
      onClose();
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        status: 'active',
        gender: 'male',
        dateOfBirth: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 h-[90%] overflow-auto w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Create New User</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              placeholder="e.g., admin, user, support"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
    let filtered = users;
    if (statusFilter !== 'All status') {
      filtered = users.filter((user) => user.status === statusFilter);
    }
    return filtered.length;
  }, [users, statusFilter]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (statusFilter !== 'All status') {
      filtered = users.filter((user) => user.status === statusFilter);
    }
    // Apply pagination
    const startIndex = (currentPage - 1) * 20;
    return filtered.slice(startIndex, startIndex + 20);
  }, [users, statusFilter, currentPage]);

  const fetchUsers = async (searchTerm: string = '') => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
      });
      const response = await fetch(`/api/admin/user?${params}`, {
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
          homeAddress: '', // Not in API
          dob: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
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

  // Fetch users on mount and when search changes
  useEffect(() => {
    fetchUsers(search);
  }, [search]);

  // Reset page when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  // Update totalPages when filtered count changes
  useEffect(() => {
    setTotalPages(Math.ceil(totalFiltered / 20));
  }, [totalFiltered]);

  const statusColors: Record<string, string> = {
    Active: 'bg-[#D1FAE5] text-[#10B981]',
    Suspended: 'bg-[#FEF3C7] text-[#F59E0B]',
  };

  if (loading) {
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
      <div className="flex flex-col space-y-2 md:space-y-0 space-x-0 md:space-x-8 md:flex-row md:items-center md:justify-between">
        <div className="w-full">
          <label htmlFor="user-search" className="sr-only">Search users</label>
          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email, phone, status"
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
          onClick={() => setShowCreateModal(true)}          className="md:hidden inline-flex items-center rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[#4338ca] transition"
        >
          Create User
        </button>
        <button
          onClick={() => setShowCreateModal(true)}          className="flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white shadow hover:bg-[#4338ca] transition"
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No users match your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-2 md:py-4 whitespace-nowrap w-fit">{user.fullName}</td>
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
        onUserCreated={() => fetchUsers(search)}
      />
    </div>
  );
}
