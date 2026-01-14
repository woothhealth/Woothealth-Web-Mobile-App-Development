'use server'

import axios from 'axios';
import { account } from './appwrite';
import { redirect } from 'next/navigation';
import { deleteSession, setSession } from './session';
import { registerSchema } from './validator/register';
import { getUserByEmail } from './api/users';

const API_UR = "http://localhost:3001"


export const loginAction = async (formData: FormData) => {
  // ✅ POST semantics — data comes from form body
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  // ⚠️ Mock auth (json-server limitation)
  const user = await getUserByEmail(email);

  if (!user || user.password !== password) {
    return { success: false, message: "Invalid credentials" };
  }

  // ✅ Session stores IDENTITY only
  await setSession({
    id: user.id,
    role: user.role,
  });

  return {
    success: true,
    role: user.role,
  };
};


// export const loginAction = async (formData: FormData) => {
//   const email = formData.get("email");
//   const password = formData.get("password");

//   const res = await axios.get(
//     `${API_UR}/users?email=${email}&password=${password}`
//   );

//   const user = res.data[0];
//   if (!user) {
//     return { success: false, message: "Invalid credentials" };
//   }
//   await setSession({name: user.name, email: user.email, id: user.id})
//   // Role-based redirect
//   return {
//     success: true,
//     role: user.role
//   };
// };

export const logoutAction = async () => {
  await deleteSession();
  redirect("/login")
};

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