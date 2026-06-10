'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MdSearch } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import type { Claim, ClaimStatus } from './mockClaims';
import { useProviderClaims, createProviderClaim } from '@/lib/providerClaims';
import { useQueryClient } from '@tanstack/react-query';
import { FaX } from 'react-icons/fa6';

const STATUS_OPTIONS: { label: string; value: ClaimStatus | 'all' }[] = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const ClaimsPage = () => {
  const queryClient = useQueryClient();
  const PROVIDER_CLAIMS_KEY = ['provider-claims'] as const;
  const { data: claimsData, isLoading: isClaimsLoading, isError: isClaimsError } = useProviderClaims();
  const claims: Claim[] = Array.isArray(claimsData) ? claimsData : [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | 'all'>('all');
  const [showCreateClaim, setShowCreateClaim] = useState(false);
  const [hmoId, setHmoId] = useState('');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClaims = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return claims.filter((claim) => {
      const matchesStatus = selectedStatus === 'all' || claim.status === selectedStatus;
      const matchesQuery =
        !normalizedQuery ||
        [claim.patientName, claim.hmoId, claim.paCode, claim.providerName]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [claims, searchQuery, selectedStatus]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-[#10B9811A] text-[#10B981]';
      case 'pending':
        return 'bg-[#F59E0B1A] text-[#F59E0B]';
      case 'rejected':
        return 'bg-[#EF44441A] text-[#EF4444]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateClaim = async () => {
    if (isSubmitting) return;

    if (!hmoId.trim()) {
      toast.error('HMO ID is required');
      return;
    }

    if (!authorizationCode.trim()) {
      toast.error('Authorization Code is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        // Only send the required fields to the backend per API: hmoId and authorizationCode
        hmoId: hmoId.trim(),
        authorizationCode: authorizationCode.trim(),
      };

      await createProviderClaim(payload);
      await queryClient.invalidateQueries({ queryKey: PROVIDER_CLAIMS_KEY });
      toast.success('Claim filed successfully');
      setShowCreateClaim(false);
      setHmoId('');
      setAuthorizationCode('');
    } catch (error: any) {
      console.error('Claim submission failed', error);
      toast.error(error?.message || 'Failed to file claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full px-4 py-6 space-y-6">
      <div className="flex gap-4 items-center md:w-[90%] md:mx-auto">
        <div className="flex-1 relative">
          <MdSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, HMO ID, provider, or PA code"
            className="w-full rounded-2xl border border-slate-300 bg-white px-12 py-3 text-sm text-slate-800 outline-none focus:border-[#49A5EF] focus:ring-2 focus:ring-[#49A5EF]/20"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#49A5EF] focus:ring-2 focus:ring-[#49A5EF]/20 min-w-[140px]"
            >
              <span>{STATUS_OPTIONS.find(option => option.value === selectedStatus)?.label}</span>
              <svg
                className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-10 mt-1 w-full min-w-[140px] rounded-2xl border border-slate-300 bg-white shadow-lg">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedStatus(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition hover:bg-slate-50 first:rounded-t-2xl last:rounded-b-2xl ${
                      selectedStatus === option.value ? 'bg-[#49A5EF]/10 text-[#49A5EF] font-medium' : 'text-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateClaim(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#49A5EF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3d8ed8]"
        >
          <FaPlus />
          File a Claim
        </button>
      </div>

      <div className="overflow-hidden rounded-[15px] bg-white shadow-sm">
        <table className="w-full border-collapse text-[15px]">
          <thead className="text-left font-semibold text-slate-900 text-base border-b border-border">
            <tr>
              <th className="px-6 py-4">Date of Service</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">HMO ID</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center">
                  No claims match your search or filter.
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => (
                <tr key={claim.id} className="divide-y divide-border hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">{formatDate(claim.dateOfService)}</td>
                  <td className="px-6 py-4">{claim.patientName}</td>
                  <td className="px-6 py-4">{claim.hmoId}</td>
                  <td className="px-6 py-4">₦{claim.amount.toLocaleString()}</td>
                  <td className="text-center px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(claim.status)}`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/test/providers/claims/${claim.id}`}
                      className="inline-flex rounded-full bg-[#49A5EF1A] text-primary px-4 py-2 text-sm font-semibold transition hover:bg-slate-100"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateClaim(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-[18px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">File a Claim</h2>
              </div>
              <div
                onClick={() => setShowCreateClaim(false)}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer transition"
              >
                <FaX size={18} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">HMO ID</label>
                <input
                  value={hmoId}
                  onChange={(e) => setHmoId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#49A5EF] focus:ring-2 focus:ring-[#49A5EF]/20"
                  placeholder="Enter HMO ID"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">PA Code</label>
                <input
                  value={authorizationCode}
                  onChange={(e) => setAuthorizationCode(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#49A5EF] focus:ring-2 focus:ring-[#49A5EF]/20"
                  placeholder="Enter PA Code"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCreateClaim(false)}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClaim}
                  disabled={isSubmitting}
                  className="rounded-full bg-[#49A5EF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3d8ed8] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsPage;
