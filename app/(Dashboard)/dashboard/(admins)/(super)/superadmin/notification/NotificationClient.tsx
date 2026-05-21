'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaBell, FaHourglassHalf, FaTimes } from 'react-icons/fa';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const { notifications, markAsRead, dismissNotification } = useNotifications();

  const filteredNotifications = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return notifications;
    return notifications.filter((n) => {
      const t = (n.title || '').toLowerCase();
      const m = (n.message || '').toLowerCase();
      return t.includes(q) || m.includes(q) || (n.type || '').toLowerCase().includes(q);
    });
  }, [searchTerm, notifications]);

  const openDetail = (id: string) => {
    setSelected(id);
    markAsRead(id);
  };

  const closeDetail = () => setSelected(null);

  const sel = notifications.find((n) => n.id === selected) ?? null;
  const router = useRouter();

  const getNotificationLink = (n: any): string | null => {
    if (!n) return null;
    const raw = n.raw || {};
    const msg = (n.message || '').toString().toLowerCase();
    if (raw.userId) return `/dashboard/superadmin/enrollees/view?id=/${encodeURIComponent(raw.userId)}`;
    if (/session|appointment/.test(msg)) return '/dashboard/superadmin/telemedicine';
    if (/pre-?employment|test/.test(msg)) return '/dashboard/superadmin/pre-employment';
    return null;
  };

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
            placeholder="Search notifications..."
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
            <div
              key={notification.id}
              onClick={() => openDetail(notification.id)}
              className={`block bg-[#ffffff] p-4 rounded-[10px] md:px-5 md:py-4 transition hover:shadow-sm cursor-pointer ${!notification.read ? 'bg-[#E5F2FF]' : ''}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${notification.read ? 'text-primary bg-[#E5F2FF]' : 'text-[#F59E0B] bg-[#F59E0B1A]'}`}>
                    {notification.read ? <FaBell /> : <FaHourglassHalf />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{notification.title || 'Notification'}</p>
                    <p className="text-sm text-slate-500">{notification.message}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-600">{new Date(notification.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail popup */}
      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="md:w-xl w-full bg-white rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{sel.title || 'Notification'}</h3>
                <p className="text-sm text-slate-500 mt-1">{new Date(sel.timestamp).toLocaleString()}</p>
              </div>
              <div className="flex">
                <button onClick={closeDetail} className="px-3 py-1">
                  <FaTimes size={22} />
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-700">
              <pre className="whitespace-pre-wrap">{sel.message}</pre>
            </div>

            <div className="flex w-full gap-6 justify-end">
              <button
                    onClick={() => { dismissNotification(sel.id); closeDetail(); }}
                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    Dismiss
                  </button>
                  {getNotificationLink(sel) && (
                    <button
                      onClick={() => { router.push(getNotificationLink(sel)!); closeDetail(); }}
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Go to
                    </button>
                  )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
