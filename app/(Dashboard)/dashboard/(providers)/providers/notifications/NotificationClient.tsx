'use client';

import React, { useMemo, useState } from 'react';
import { MdErrorOutline, MdAccessTime, MdSearch } from 'react-icons/md';
import { toast } from 'sonner';
import { CgSandClock } from "react-icons/cg";
import NotificationPopup from './NotificationPopup';
import { MOCK_NOTIFICATIONS, type Notification } from './mockNotifications';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const getStatusIcon = (status: Notification['status']) => {
  switch (status) {
    case 'approved':
      return <IoMdCheckmarkCircleOutline className="text-emerald-600" size={28} />;
    case 'denied':
      return <MdErrorOutline className="text-red-600" size={28} />;
    default:
      return <CgSandClock className="text-amber-600" size={28} />;
  }
};

const pageSize = 5;

const NotificationClient: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNotifications = useMemo(() => {
    return MOCK_NOTIFICATIONS.filter((item) =>
      [item.firstname, item.lastname, item.hmoId, item.plan, item.status, item.paCode]
        .some((value) => value.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  const pageCount = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const paginatedNotifications = filteredNotifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error('Enter a search term first');
      return;
    }

    const result = MOCK_NOTIFICATIONS.find((item) =>
      [item.firstname, item.lastname, item.hmoId, item.plan, item.status, item.paCode]
        .some((value) => value.toLowerCase().includes(query.toLowerCase()))
    );

    if (!result) {
      toast.error('No notification found');
      return;
    }

    setSelectedNotification(result);
  };

  const handleSelect = (notification: Notification) => setSelectedNotification(notification);

  return (
    <div className="p-4 rounded-[10px] bg-white shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex w-full items-center space-x-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notifications"
            className="py-3 flex-1 rounded-[10px] px-4 text-sm text-slate-900 outline-none focus:border-primary border border-border focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={handleSearch}
            className="inline-flex h-12 items-center justify-center rounded-[10px] bg-primary px-6 text-white transition hover:bg-blue-700"
          >
            <MdSearch className="mr-2 text-2xl" />
            Search
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {paginatedNotifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleSelect(notification)}
            className="w-full rounded-[10px] bg-[#E5E7EB33] p-4 text-left shadow-sm transition hover:border-blue-300 cursor-pointer hover:bg-blue-50"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-slate-100">
                  {getStatusIcon(notification.status)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{notification.paCode}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Page {currentPage} of {pageCount}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
            disabled={currentPage === pageCount}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          >
            Next
          </button>
        </div>
      </div>

      <NotificationPopup
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
      />
    </div>
  );
};

export default NotificationClient;
