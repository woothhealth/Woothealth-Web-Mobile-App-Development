'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaBell } from 'react-icons/fa';
import { mockNotifications } from './mockNotifications';

export default function NotificationClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredNotifications = useMemo(() => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) return mockNotifications;
    return mockNotifications.filter((notification) =>
      [notification.title, notification.agent, notification.timeframe, notification.requestedBy]
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6 px-2">
        <div className="w-full md:w-[70%] md:mx-auto">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSearchActive(true)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <FaSearch />
            </button>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              placeholder="Search notifications or agent..."
              className="w-full rounded-2xl border border-[#D9D9D9] bg-[#F8FAFC] px-12 py-3 text-sm text-slate-900 focus:border-[#49A5EF] focus:outline-none focus:ring-1 focus:ring-[#49A5EF]"
            />
          </div>
        </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-8 text-center text-sm text-slate-500">
            No notifications match your search.
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <Link
              key={notification.id}
              href={`/dashboard/superadmin/notification/`}
              className="block bg-[#ffffff] p-4 rounded-[10px] md:px-5 md:py-4 transition hover:shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E5F2FF] text-[#49A5EF]">
                    <FaBell />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{notification.title}</p>
                    <p className="text-sm text-slate-500">Assigned to {notification.agent}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-600">{notification.timeframe}</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
