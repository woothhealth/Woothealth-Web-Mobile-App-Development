'use client';

import React from 'react';
import { MdClose } from 'react-icons/md';
import type { Enrollee } from './page';
import { group } from 'console';

interface VerificationModalProps {
  isOpen: boolean;
  enrollee: Enrollee | null;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  enrollee,
  onClose,
}) => {
  if (!isOpen || !enrollee) return null;

  // Get initials from first and last name
  const initials = `${enrollee.firstName.charAt(0)}${enrollee.lastName.charAt(0)}`.toUpperCase();

  // Get background color based on status
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

  const profileData = [
    {
      group: 1,
      label: 'First Name',
      value: enrollee.firstName,
    },
    {
      group: 2,
      label: 'Last Name',
      value: enrollee.lastName,
    },
    {
      group: 1,
      label: 'HMOID',
      value: enrollee.userId,
    },
    {
      group: 2,
      label: 'Plan',
      value: enrollee.plan,
    },
    {
      group: 1,
      label: 'Status',
      value: enrollee.status.charAt(0).toUpperCase() + enrollee.status.slice(1),
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center py-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full h-fit py-8 animate-in fade-in zoom-in duration-300 overflow-y-auto space-y-4 border-t-4 border-[#10B981]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <MdClose size={28} />
        </button>

        {/* Profile Section */}
        <div className="text-center border-b border-[#D9D9D9] pb-6 h-fit">
          {/* Avatar */}
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white border-2 border-[#D9D9D9] text-3xl font-bold shadow-lg">
            {initials}
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold text-gray-900 uppercase">
            {enrollee.firstName} {enrollee.lastName}
          </h2>
        </div>

        {/* Details Section */}
        <div className="space-y-1 px-8">
          {profileData.map((item) => {
            const groupClass = item.group === 1 ? 'bg-[#F8F9FA]' : '';
            return (
              <div key={item.label} className={`flex items-center justify-between px-4 py-2 rounded-[10px] ${groupClass}`}>
                <p className="font-semibold">{item.label}</p>
                <p className={`font-medium px-2 rounded-[10px] uppercase ${getStatusColor(item.label === 'Status' ? enrollee.status : '')}`}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
