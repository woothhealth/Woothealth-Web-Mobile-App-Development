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

  const handleVerifyEnrollee = async (userId: string) => {
    if (!userId.trim()) {
      toast.error('Please enter an HMOID to verify');
      return;
    }

    setIsLoading(true);
    try {
      // Search for enrollee in loaded data
      const enrollee = enrollees.find(
        (e) => e.userId.toLowerCase() === userId.toLowerCase()
      );

      if (!enrollee) {
        toast.error('Invalid HMOID! This ID is not a registered woothealth HMOID.');
        setIsLoading(false);
        return;
      }

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

  // Fetch enrollees from proxy on mount
  useEffect(() => {
    let mounted = true;
    const fetchEnrollees = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/pr/enrollees', { credentials: 'include' });
        const data = await res.json();
        console.debug('provider enrollees response:', res.status, data);
        if (!res.ok) {
          toast.error((data && (data.message || data.error)) || 'Failed to load enrollees');
          return;
        }
        if (mounted) setEnrollees(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error('Failed to fetch enrollees:', err);
        toast.error('Failed to load enrollees');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchEnrollees();
    return () => { mounted = false; };
  }, []);

  const handleViewEnrollee = (enrollee: Enrollee) => {
    setSelectedEnrollee(enrollee);
    setIsModalOpen(true);
  };

  const handleLoadEnrollees = (data: Enrollee[]) => {
    setEnrollees(data);
  };

  return (
    <div className=" p-6">
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