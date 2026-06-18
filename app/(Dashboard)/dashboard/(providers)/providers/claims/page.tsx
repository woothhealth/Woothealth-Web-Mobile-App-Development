'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MdSearch } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import type { Claim, ClaimStatus } from './mockClaims';
import { useProviderClaims } from '@/lib/providerClaims';
import { useQueryClient } from '@tanstack/react-query';
import CreateClaimModal from './CreateClaimModal';
import { FaChevronDown } from 'react-icons/fa6';

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

  const handleModalSuccess = async (created: any) => {
    try {
      await queryClient.invalidateQueries({ queryKey: PROVIDER_CLAIMS_KEY });
      toast.success('Claim filed successfully');
    } catch (e) {
      // ignore
    }
    setShowCreateClaim(false);
  };

  return (
    <div className="h-full px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center md:w-[90%] md:mx-auto">
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
              className="flex items-center justify-between rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#49A5EF] focus:ring-2 focus:ring-[#49A5EF]/20 min-w-35"
            >
              <span>{STATUS_OPTIONS.find(option => option.value === selectedStatus)?.label}</span>
              <FaChevronDown size={14}
                className={`ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 z-10 mt-1 w-full min-w-35 rounded-2xl border border-slate-300 bg-white shadow-lg">
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
          className="inline-flex items-center gap-2 rounded-full w-fit bg-[#49A5EF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3d8ed8]"
        >
          <FaPlus />
          File a Claim
        </button>
      </div>

      <div className="overflow-auto rounded-[15px] bg-white shadow-sm custom-scrollbar">
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
        <CreateClaimModal open={showCreateClaim} onClose={() => setShowCreateClaim(false)} onSuccess={handleModalSuccess} />
      )}
    </div>
  );
};

export default ClaimsPage;