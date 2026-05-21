'use client';

import React, { useState } from 'react';
import PaCodeTrackingTable from './PaCodeTrackingTable';
import PaCodeDetailsModal from './PaCodeDetailsModal';
import type { PaCode } from '../../types';

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
    <div className="h-full p-4">
      <div className="w-full mx-auto">
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
