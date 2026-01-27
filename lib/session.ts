'use server';

import { cookies } from 'next/headers';

const SESSION_KEY = 'session';
const ROLE_KEY = 'role';

type SessionData = {
  id: string;
  role: string;
  name: string;
  email: string;
};

export const setSession = async (
  data: SessionData,
  remember = false
) => {
  const maxAge = remember
    ? 60 * 60 * 24 * 7
    : 60 * 60 * 2;

  const cookieStore = (await cookies());

  cookieStore.set(SESSION_KEY, data.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });

  cookieStore.set(ROLE_KEY, data.role, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
};

export const getSession = async () => {
  const cookieStore = (await cookies());

  const id = cookieStore.get(SESSION_KEY)?.value;
  const role = cookieStore.get(ROLE_KEY)?.value;

  if (!id || !role) return null;

  return { id, role };
};

export const deleteSession = async () => {
  const cookieStore = (await cookies());

  cookieStore.delete(SESSION_KEY);
  cookieStore.delete(ROLE_KEY);
};
