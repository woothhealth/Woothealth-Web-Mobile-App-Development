 'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { deleteSession, setSession, getSession } from './session';
import { hasDashboardAccess, getDashboardPath } from './roles';

export const loginAction = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await axios.post(
    (process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL) + "/login/",
    { email, password },
    { headers: { "Content-Type": "application/json" }, withCredentials: true }
  );

  const user = res.data;

  if (!user?.userId) return { success: false, message: "Invalid credentials" };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  await fetch(`${baseUrl}/api/session`, {
    method: "POST",
    body: JSON.stringify({
      id: user.userId,
      role: user.role,
      name: user.name,
      email: user.email,
    }),
  });

  return { success: true, role: user.role };
};


export const logoutAction = async () => {
  // Determine the redirect target based on current session role.
  const session = await getSession();
  const role = session?.role || null;
  let redirectTo = '/login';
  if (hasDashboardAccess(role)) {
    // Redirect all dashboard-capable roles to the shared admin entry
    redirectTo = '/admin';
  } else if (role === 'provider') {
    redirectTo = '/providers';
  }

  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const cookieStore = await cookies();
    const cookieArray = (cookieStore.getAll?.() || []);
    const cookieHeader = cookieArray.map((c) => `${c.name}=${c.value}`).join('; ');

    if (BACKEND_URL && cookieHeader) {
      try {
        await fetch(`${BACKEND_URL}/logout`, {
          method: 'POST',
          headers: { Cookie: cookieHeader },
          credentials: 'include',
        });
      } catch (e) {
        console.warn('Failed to call backend logout', e);
      }
    } else {
      // call local proxy route via absolute URL to avoid relative URL issues in server context
      try {
        await fetch(`${baseUrl}/api/logout`, {
          method: 'POST',
          headers: { cookie: cookieHeader },
        });
      } catch (e) {
        console.warn('Failed to call local logout proxy', e);
      }
    }
  } catch (err) {
    console.warn('Failed to call logout', err);
  }

  await deleteSession();
  return { success: true, redirectTo };
};