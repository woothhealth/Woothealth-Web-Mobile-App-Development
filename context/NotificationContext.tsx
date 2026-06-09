"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

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

const DEFAULT_NOTIFICATIONS_API = (process.env.NEXT_PUBLIC_NOTIFICATIONS_API as string) || '/api/notification';

const getNotificationsApi = () => {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS_API;
  const path = window.location.pathname || '';
  // Use admin notifications proxy when on admin dashboard pages
  if (path.includes('/dashboard/superadmin') || path.includes('/dashboard/admin')) {
    return '/api/admin/notifications';
  }
  return DEFAULT_NOTIFICATIONS_API;
};

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
  const intervalRef = useRef<number | null>(null);
  const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    // Attempt to fetch notifications regardless of presence of a readable
    // document.cookie. Session cookies are often HttpOnly and won't be
    // visible to `document.cookie`, so checking cookie visibility is
    // unreliable. Instead, attempt the fetch and handle non-OK responses.
    try {
      const api = getNotificationsApi();
      console.debug('NotificationProvider: fetching', api);
      const res = await fetch(`${api}?page=1&limit=50`, { cache: 'no-store', credentials: 'include' });
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

  const fetchNewNotifications = useCallback(async () => {
    // Try polling; if the server returns 401/403 the polling will stop later.
    try {
      const api = getNotificationsApi();
      // fetch the most recent page and merge any new items
      const res = await fetch(`${api}?page=1&limit=20`, { cache: 'no-store', credentials: 'include' });
      if (!res.ok) {
        console.error('Notifications poll error', res.status, await res.text());
        return;
      }
      const payload = await res.json();
      let items: any[] = [];
      if (Array.isArray(payload)) items = payload;
      else if (Array.isArray(payload.data)) items = payload.data;
      else items = [];
      const normalized = items.map(normalize);
      if (normalized.length === 0) return;

      setNotifications((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = normalized.filter((n) => !existingIds.has(n.id));
        if (newOnes.length === 0) return prev;
        // preserve any local read/dismiss state for overlapping items
        const mergedNew = newOnes.map((n) => {
          const found = prev.find((p) => p.id === n.id);
          return found ? { ...n, read: found.read } : n;
        });
        return [...mergedNew, ...prev];
      });
    } catch (err) {
      console.error('Notifications poll error', err);
    }
  }, []);

  useEffect(() => {
    // Determine if user is logged in by calling /api/me; if not logged in, skip loading/polling
    const checkSessionAndStart = async () => {
      if (typeof window === 'undefined') return;
      try {
        const res = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });
        if (!res.ok) {
          // Not logged in or session invalid — do not start polling
          setLoggedIn(false);
          setNotifications([]);
          return;
        }
        // Logged in — proceed to load notifications and start polling
        setLoggedIn(true);
        await load();
        intervalRef.current = window.setInterval(() => {
          fetchNewNotifications();
        }, POLL_INTERVAL_MS) as unknown as number;
      } catch (err) {
        console.error('Session check failed, skipping notifications', err);
        setLoggedIn(false);
      }
    };

    checkSessionAndStart();
    return () => {};
  }, [load]);

  // cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // stop polling if logged out after initial check
  useEffect(() => {
    if (loggedIn === false && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [loggedIn]);

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
      const api = getNotificationsApi();
      const res = await fetch(`${api}?id=${encodeURIComponent(id)}`, {
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
      const api = getNotificationsApi();
      await fetch(`${api}?id=${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'include' });
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