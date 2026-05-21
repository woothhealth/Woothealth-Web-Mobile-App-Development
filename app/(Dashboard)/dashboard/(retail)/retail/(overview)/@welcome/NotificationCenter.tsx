"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaRegBell } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdDone, MdDoneAll } from "react-icons/md";
import { useNotifications } from "@/context/NotificationContext";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { notifications, markAsRead, dismissNotification } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 border rounded-full hover:bg-gray-100 transition"
      >
        <FaRegBell className="text-[18px]" />
        
        {/* Red badge indicator for unread notifications */}
        {unreadCount > 0 && (
          <div className="absolute -right-1 -top-1 bg-red-500 rounded-full">
            <span className="text-white text-[0.7rem] font-bold w-4 h-4 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute -right-10 mt-3 lg:w-70 w-60 bg-white border border-gray-200 rounded-lg shadow-xl z-40 max-h-90 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    notifications
                      .filter((n) => !n.read)
                      .forEach((n) => markAsRead(n.id));
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <MdDoneAll /> Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div>
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  } ${getTypeColor(notification.type)}`}
                >
                  {/* Notification Item */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                              title="Mark as read"
                            >
                              <MdDone size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => dismissNotification(notification.id)}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition"
                            title="Dismiss"
                          >
                            <IoClose size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
