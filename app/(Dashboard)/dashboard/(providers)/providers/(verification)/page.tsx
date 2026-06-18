'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import VerificationHeader from './VerificationHeader';
import EnrolleesTable from './EnrolleesTable';
import VerificationModal from './VerificationModal';


export interface Enrollee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  plan: string;
  status: 'active' | 'inactive' | 'expired';
  email?: string;
  phone?: string;
}

export interface VerificationData {
  enrollee: Enrollee;
  verified: boolean;
  message?: string;
}

const ProviderVerificationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnrollee, setSelectedEnrollee] = useState<Enrollee | null>(null);
  const [enrollees, setEnrollees] = useState<Enrollee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyEnrollee = async (userId: string, explicit = true) => {
    console.debug('handleVerifyEnrollee called', { userId, enrolleesLength: enrollees.length, explicit });
    // Only proceed when verification is explicitly triggered by the user
    if (!explicit) {
      console.debug('Skipping non-explicit verify call');
      return;
    }
    if (!userId || !userId.trim()) {
      toast.error('Please enter an HMOID to verify');
      return;
    }
    // Normalize input for comparison: uppercase and stripped for robust matching
    const normalizedId = String(userId || '').trim().toUpperCase();
    const normalizedIdStripped = normalizedId.replace(/[^A-Z0-9]/g, '');

    // Query the backend search endpoint for this HMOID (backend enforces provider-tier eligibility)
    console.debug('Verifying via backend search for', normalizedId);
    const { items: searchResults, backendError } = await loadEnrollees(normalizedId);
    if (backendError) {
      // Surface backend error directly to the user for debugging
      toast.error(`Backend error: ${backendError}`);
      console.error('Backend error during enrollee search:', backendError);
      return;
    }
    if (!searchResults || searchResults.length === 0) {
      toast.error('Invalid HMOID! This ID is not a registered woothealth HMOID.');
      return;
    }

    setIsLoading(true);
    try {
      // Debug: show a sample of returned results and their id fields
      try {
        const sample = searchResults.slice(0, 6).map((r) => ({
          userId: (r as any).userId,
          id: (r as any).id,
          $id: (r as any).$id,
          enrolleeNumber: (r as any).enrolleeNumber,
          policyNumber: (r as any).policyNumber,
        }));
        console.debug('searchResults sample for verify', { input: normalizedId, count: searchResults.length, sample });
      } catch (e) {
        console.debug('searchResults debug failed', e);
      }

      // Search through results and record which field matched
      let enrollee: Enrollee | undefined = undefined;
      let matchedOn: { field: string; value: string } | null = null;
      for (const r of searchResults) {
        const candidatesRaw = [
          { field: 'userId', value: (r as any).userId || '' },
          { field: 'id', value: (r as any).id || '' },
          { field: '$id', value: (r as any).$id || '' },
          { field: 'enrolleeNumber', value: (r as any).enrolleeNumber || '' },
          { field: 'policyNumber', value: (r as any).policyNumber || '' },
          { field: 'membershipNumber', value: (r as any).membershipNumber || '' },
        ];

        const normalizedCandidates = candidatesRaw.map((c) => ({ field: c.field, value: String(c.value || '').trim().toUpperCase() }));
        const strippedCandidates = normalizedCandidates.map((c) => ({ field: c.field, value: c.value.replace(/[^A-Z0-9]/g, '') }));

        // check exact normalized match
        const exact = normalizedCandidates.find((c) => c.value === normalizedId);
        if (exact) {
          enrollee = r as Enrollee;
          matchedOn = { field: exact.field, value: exact.value };
          break;
        }

        // check stripped match
        const stripped = strippedCandidates.find((c) => c.value === normalizedIdStripped);
        if (stripped) {
          enrollee = r as Enrollee;
          matchedOn = { field: stripped.field, value: stripped.value };
          break;
        }
      }

      if (!enrollee) {
        toast.error('Invalid HMOID! This ID is not a registered woothealth HMOID.');
        console.debug('Verification lookup failed', { input: normalizedId, inputStripped: normalizedIdStripped });
        setIsLoading(false);
        return;
      }

      console.debug('Verification matched enrollee', { matchedOn, enrolleeId: (enrollee as any).userId || (enrollee as any).id || (enrollee as any).$id });

      // Check if enrollee has valid plan
      if (enrollee.status === 'expired' || !enrollee.plan) {
        toast.error('This enrollee cannot access care');
        setIsLoading(false);
        return;
      }

      setSelectedEnrollee(enrollee as Enrollee);
      setIsModalOpen(true);
      toast.success('Enrollee verified successfully');
    } catch (error) {
      toast.error('An error occurred while verifying the enrollee');
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extracted loader so we can call it on demand (e.g., when verifying)
  const loadEnrollees = async (search?: string): Promise<{ items: Enrollee[]; backendError?: string }> => {
    console.debug('loadEnrollees: starting', { search });
    setIsLoading(true);
    try {
      const url = search ? `/api/pr/enrollees?search=${encodeURIComponent(search)}` : '/api/pr/enrollees';
      console.debug('loadEnrollees: fetching url=', url);
      const res = await fetch(url, { credentials: 'include' });
      const text = await res.text();
      console.debug('loadEnrollees: raw response text length=', String(text).length, 'status=', res.status);
      let data: any = null;
      try { data = JSON.parse(text); } catch { data = text; }
      console.debug('provider enrollees response:', res.status, data);

      // If backend returned an envelope with an explicit error, surface it
      if (data && typeof data === 'object' && (data.error || data.success === false || data.details)) {
        const msg = data.error || data.message || JSON.stringify(data.details || data);
        console.error('Backend reported error for /provider/enrollees', msg, data);
        return { items: [], backendError: String(msg) };
      }

      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || 'Failed to load enrollees';
        toast.error(msg);
        return { items: [], backendError: String(msg) };
      }

      const list = Array.isArray(data) ? data : (data.data || []);
      console.debug('loadEnrollees: loaded', { count: list.length, search });
      if (!search) setEnrollees(list as Enrollee[]);
      return { items: list as Enrollee[] };
    } catch (err: any) {
      console.error('Failed to fetch enrollees:', err);
      const msg = err?.message || 'Failed to load enrollees';
      toast.error(msg);
      return { items: [], backendError: String(msg) };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // call loader once on mount
    loadEnrollees();
  }, []);

  const handleViewEnrollee = (enrollee: Enrollee) => {
    setSelectedEnrollee(enrollee);
    setIsModalOpen(true);
  };

  const handleLoadEnrollees = (data: Enrollee[]) => {
    setEnrollees(data);
  };

  return (
    <div className="px-4 py-6 md:px-6">
      <div className="w-full mx-auto space-y-8">
        {/* Verification Header */}
        <VerificationHeader
          onVerify={handleVerifyEnrollee}
          isLoading={isLoading}
        />

        {/* Enrollees Table */}
        <EnrolleesTable
          enrollees={enrollees}
          onViewEnrollee={handleViewEnrollee}
          onLoadEnrollees={handleLoadEnrollees}
        />

        {/* Verification Modal */}
        {selectedEnrollee && (
          <VerificationModal
            isOpen={isModalOpen}
            enrollee={selectedEnrollee}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEnrollee(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderVerificationPage;