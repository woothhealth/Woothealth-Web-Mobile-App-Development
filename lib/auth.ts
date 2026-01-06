import { account } from './appwrite';

export async function loginUser(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession({ email, password });
    return session;
  } catch (error: any) {
    throw new Error(error?.message || "Invalid email or password");
  }
}


// Get current user from Appwrite
export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

// Logout user from Appwrite
export async function logoutUser() {
  try {
    await account.deleteSession('current');
  } catch {}
}


export async function registerUser({ email, password, ...rest }: { email: string, password: string, [key: string]: any }) {
  try {
    const user = await account.create({
      userId: 'unique()',
      email,
      password,
      name: rest.firstName ? `${rest.firstName} ${rest.lastName || ''}`.trim() : undefined,
    });
    return user;
  } catch (error: any) {
    throw new Error(error?.message || "Registration failed");
  }
}