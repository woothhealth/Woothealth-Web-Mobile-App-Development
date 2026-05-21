"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type NotificationItem = {
  id: string;
  title?: string;
  message: string;
  read: boolean;
  type?: string;
  priority?: number;
  timestamp: string;
  raw?: any;
};

interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: string) => string;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_API = (process.env.NEXT_PUBLIC_NOTIFICATIONS_API as string) || '/api/notification';

const normalize = (n: any): NotificationItem => {
  const id = n.$id || n.notificationId || n.notification_id || n.id || String(Math.random());
  const ts = n.$createdAt || n.createdAt || n.created_at || new Date().toISOString();
  const timestamp = new Date(ts).toISOString();
  const status = (n.status || n.read || 'unread').toString().toLowerCase();
  const message = n.originalMessage ?? n.message ?? '';
  const title = n.title ?? (message ? (message.length > 80 ? message.slice(0, 77) + '...' : message) : undefined);
  return {
    id,
    title,
    message,
    read: status === 'read' || status === 'seen' || status === 'opened',
    type: n.notificationType || n.type || 'info',
    priority: n.priorityLevel ?? n.priority ?? 0,
    timestamp,
    raw: n,
  };
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const load = useCallback(async () => {
    try {
      // If running in browser and there's no session/role cookie, skip loading notifications.
      // Always attempt to fetch notifications from the proxy. Session cookies are often HttpOnly
      // and not visible via `document.cookie`, so client-side checks are unreliable.
      console.debug('NotificationProvider: fetching', NOTIFICATIONS_API);
      const res = await fetch(`${NOTIFICATIONS_API}?page=1&limit=50`, { cache: 'no-store', credentials: 'include' });
      if (!res.ok) {
        const text = await res.text();
        console.error('Notifications proxy error', res.status, text);
        // Do not throw here; backend may be returning 403 while debugging. Clear notifications and return.
        setNotifications([]);
        return;
      }
      const payload = await res.json();
      let items: any[] = [];
      if (Array.isArray(payload)) items = payload;
      else if (Array.isArray(payload.data)) items = payload.data;
      else items = [];
      const normalized = items.map(normalize);
      setNotifications(normalized);
    } catch (err) {
      console.error('Notifications load error', err);
    }
  }, []);

  useEffect(() => {
    // Run a single load on mount. Disable polling while notifications backend is being debugged.
    load();
    return () => {};
  }, [load]);

  const addNotification = useCallback((title: string, message: string, type = 'info') => {
    const id = `local-${Date.now()}-${Math.random()}`;
    const item: NotificationItem = { id, title, message, read: false, type, priority: 0, timestamp: new Date().toISOString(), raw: null };
    setNotifications((s) => [item, ...s]);
    return id;
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    // optimistic update
    setNotifications((s) => s.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      const res = await fetch(`${NOTIFICATIONS_API}?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
        credentials: 'include',
      });
      if (!res.ok) {
        console.error('markAsRead failed', res.status, await res.text());
        // revert optimistic change
        setNotifications((s) => s.map((n) => (n.id === id ? { ...n, read: false } : n)));
      }
    } catch (err) {
      console.error('markAsRead error', err);
      setNotifications((s) => s.map((n) => (n.id === id ? { ...n, read: false } : n)));
    }
  }, []);

  const dismissNotification = useCallback(async (id: string) => {
    setNotifications((s) => s.filter((n) => n.id !== id));
    try {
      await fetch(`${NOTIFICATIONS_API}?id=${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'include' });
    } catch (err) {
      console.error('dismissNotification error', err);
    }
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, dismissNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
}

export default NotificationContext;