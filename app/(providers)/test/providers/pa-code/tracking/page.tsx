'use client';

import React, { useState } from 'react';
import PaCodeTrackingTable from './PaCodeTrackingTable';
import PaCodeDetailsModal from './PaCodeDetailsModal';
import type { PaCode } from '../types';

const PaCodeTrackingPage = () => {
  const [selectedPaCode, setSelectedPaCode] = useState<PaCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (paCode: PaCode) => {
    setSelectedPaCode(paCode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaCode(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PA Code Tracking
          </h1>
          <p className="text-gray-600">
            Track and manage your Prior Authorization code requests
          </p>
        </div>

        {/* PA Code Tracking Table */}
        <PaCodeTrackingTable onViewDetails={handleViewDetails} />

        {/* PA Code Details Modal */}
        {selectedPaCode && (
          <PaCodeDetailsModal
            paCode={selectedPaCode}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default PaCodeTrackingPage;
