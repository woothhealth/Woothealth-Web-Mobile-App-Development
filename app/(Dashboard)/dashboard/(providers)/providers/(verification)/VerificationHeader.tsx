'use client';

import React, { useState } from 'react';
import { MdSearch } from 'react-icons/md';

interface VerificationHeaderProps {
  onVerify: (hmoid: string, explicit?: boolean) => void;
  isLoading: boolean;
}

const VerificationHeader: React.FC<VerificationHeaderProps> = ({
  onVerify,
  isLoading,
}) => {
  const [hmoid, setHmoid] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = hmoid.trim().toUpperCase();
    // explicit = true indicates user-initiated verification
    onVerify(normalized, true);
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-[#ffffff]">
          <input
            type="text"
            placeholder="Enter HMOID to verify..."
            value={hmoid}
            onChange={(e) => setHmoid(e.target.value.toUpperCase())}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#49A5EF] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-[#49A5EF] text-white font-semibold rounded-lg hover:bg-blue-300 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Enrollee'
          )}
        </button>
      </form>
    </div>
  );
};

export default VerificationHeader;