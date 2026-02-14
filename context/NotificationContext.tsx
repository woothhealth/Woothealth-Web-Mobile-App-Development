"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: "info" | "warning" | "error" | "success";
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    title: string,
    message: string,
    type?: "info" | "warning" | "error" | "success"
  ) => string;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (
      title: string,
      message: string,
      type: "info" | "warning" | "error" | "success" = "info"
    ) => {
      const id = `notif-${Date.now()}-${Math.random()}`;
      const newNotification: Notification = {
        id,
        title,
        message,
        timestamp: new Date(),
        read: false,
        type,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      return id;
    },
    []
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        dismissNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
