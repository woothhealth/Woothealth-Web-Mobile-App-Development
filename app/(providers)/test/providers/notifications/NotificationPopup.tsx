'use client';

import React from 'react';
import { MdClose } from 'react-icons/md';
import type { Notification } from './mockNotifications';

interface NotificationPopupProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

const initials = (firstname: string, lastname: string) => {
  const firstInitial = firstname.charAt(0).toUpperCase();
  const lastInitial = lastname.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}

const statusColors = {
  approved: 'bg-emerald-100 text-emerald-800',
  denied: 'bg-red-100 text-red-800',
  pending: 'bg-amber-100 text-amber-800',
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, isOpen, onClose }) => {
  if (!isOpen || !notification) return null;

  const notificationStatusClass = statusColors[notification.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">

      <div
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />
      <div className={`w-full max-w-xl h-fit rounded-2xl z-10 bg-white p-6 shadow-xl border-t-4 ${notificationStatusClass} border-${notification.status}-300`}>
        <div className="relative flex items-center justify-center mb-6 text-[#000000]">
          <div className='flex flex-col items-center justify-center'>
            <div className='rounded-full h-26 w-26 flex items-center justify-center bg-slate-200 text-3xl font-bold'>
              {initials(notification.firstname, notification.lastname)}
            </div>
            <p className="text-2xl font-bold">
              {notification.firstname} {notification.lastname}
            </p>
          </div>
          <button onClick={onClose} className="absolute right-0 top-0 text-slate-400 hover:text-slate-700">
            <MdClose size={22} />
          </button>
        </div>

        <div className="flex flex-col space-y-2 text-slate-900">
          <div className="flex justify-between items-center">
            <p className="text-xs uppercase tracking-[0.2em]">First name</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{notification.firstname}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs uppercase tracking-[0.2em]">Last name</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{notification.lastname}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs uppercase tracking-[0.2em]">HMO ID</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{notification.hmoId}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs uppercase tracking-[0.2em]">Plan</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{notification.plan}</p>
          </div>
          <div className="flex justify-between items-center sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em]">Status</p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              <span className={`${notificationStatusClass} px-4 py-1 rounded-[5px] text-sm`}>
                {notification.status}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
