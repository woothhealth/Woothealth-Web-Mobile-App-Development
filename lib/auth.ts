'use server'

import axios from 'axios';
import { redirect } from 'next/navigation';
import { deleteSession, setSession } from './session';
import { registerSchema } from './validator/register';
import { getUserByEmail } from './api/users';
import { api } from "@/lib/api/client";
import { sanitizeInput } from "@/lib/validator/sanitize";

// export const loginAction = async (formData: FormData) => {
//   const email = formData.get("email")?.toString().trim().toLowerCase();
//   const password = formData.get("password")?.toString().trim();

//   if (!email || !password) {
//     return {
//       success: false,
//       message: "Email and password are required",
//     };
//   }

//   try {
//     const res = await api.post(
//       "/login/",
//       { email, password },
//       { withCredentials: true }
//     );

//     const user = res.data.user;

//     await setSession({
//       id: user.id,
//       role: "retail",
//     });

//     return {
//       success: true,
//       role: user.role,
//     };
//   } catch (error: any) {
//     console.error("LOGIN ACTION ERROR", error);
//     return {
//       success: false,
//       message:
//         error?.response?.data?.message || "Invalid login credentials",
//     };
//   }
// };

const API_UR = process.env.NEXT_PUBLIC_API_URL;

// export const loginAction = async (formData: FormData) => {
//   const email = formData.get("email") as string | null;
//   const password = formData.get("password") as string | null;

//   if (!email || !password) {
//     return { success: false, message: "Email and password required" };
//   }

//   try {
//     const res = await axios.get(`${API_UR}/users`, {
//       email,
//       password,
//     });

//     const user = res.data?.user;

//     if (!user) {
//       return { success: false, message: "Invalid credentials" };
//     }

//     await setSession({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role, // ✅ CRITICAL
//     });

//     return {
//       success: true,
//       role: user.role,
//     };
//   } catch (error: any) {
//     console.error("LOGIN ACTION ERROR 👉", error);
//     return {
//       success: false,
//       message: error?.response?.data?.message || "Login failed",
//     };
//   }
// };

export const loginAction = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  
  const res = await axios.get(`${API_UR}/users?email=${email}&password=${password}`);
  
  const user = res.data[0];
  
  if (!user) { return { success: false, message: "Invalid credentials" }; }
  await setSession({name: user.name, email: user.email, id: user.id, role: user.role}) 
  // Role-based redirect
  return { success: true, role: user.role };
};

// export const loginAction = async (formData: FormData) => {
//   try {
//     // 1️⃣ Extract & sanitize inputs
//     const rawEmail = formData.get("email");
//     const rawPassword = formData.get("password");

//     const email = sanitizeInput(rawEmail)?.toLowerCase();
//     const password = sanitizeInput(rawPassword);

//     if (!email || !password) {
//       return {
//         success: false,
//         message: "Email and password are required",
//       };
//     }

//     /**
//      * 2️⃣ MOCK AUTH (json-server limitation)
//      * json-server does NOT support POST /login
//      * So we query users and validate manually
//      */
//     const res = await api.get("/users", {
//       params: { email },
//     });

//     const user = res.data?.[0];

//     if (!user || user.password !== password) {
//       return {
//         success: false,
//         message: "Invalid email or password",
//       };
//     }

//     /**
//      * 3️⃣ Create session (IDENTITY ONLY)
//      * NEVER store full user object in cookies
//      */
//     await setSession({
//       id: user.id,
//       role: user.role,
//     });

//     /**
//      * 4️⃣ Return role for redirect logic
//      */
//     return {
//       success: true,
//       role: user.role,
//     };
//   } catch (error) {
//     console.error("LOGIN ACTION ERROR 👉", error);

//     return {
//       success: false,
//       message: "Login failed. Please try again.",
//     };
//   }
// };



export const logoutAction = async () => {
  await deleteSession();
  redirect("/login")
};