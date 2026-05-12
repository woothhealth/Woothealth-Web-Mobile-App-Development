export type AdminUser = {
  $id?: string;
  userId?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  status?: string;
  providerName?: string;
  plan?: string | null;
  [key: string]: any;
};

export async function getAdminUserById(userId: string): Promise<AdminUser | null> {
  if (!userId) {
    return null;
  }

  try {
    const res = await fetch(`/api/admin/user?userId=${encodeURIComponent(userId)}`, {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const payload = data?.data ?? data;

    if (!payload) {
      return null;
    }

    if (Array.isArray(payload)) {
      return payload.find(
        (user: any) => user.userId === userId || user.$id === userId || user.id === userId
      ) || null;
    }

    return payload as AdminUser;
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return null;
  }
}
