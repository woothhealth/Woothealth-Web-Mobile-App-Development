'use server';

import axios from 'axios';
import { redirect } from 'next/navigation';
import { deleteSession, setSession } from './session';

// export const loginAction = async (formData: FormData) => {
//   const email = formData.get("email");
//   const password = formData.get("password");

//   try {
//     const res = await axios.post(
//       "https://backend.woothealth.com/login/",
//       { email, password },
//       {
//         headers: { "Content-Type": "application/json" },
//         withCredentials: true, // ✅ SESSION SUPPORT
//       }
//     );

//     const user = res.data;

//     if (!user?.userId) {
//       return { success: false, message: "Invalid credentials" };
//     }

//     await setSession({
//       name: user.name,
//       email: user.email,
//       id: user.userId,
//       role: user.role,
//     });

//     return { success: true, role: user.role };
//   } catch (error: any) {
//     console.log(error.response?.status);
//     console.log(error.response?.data);

//     return {
//       success: false,
//       message: error.response?.data?.error || "Login failed",
//     };
//   }
// };

export const loginAction = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await axios.post(
    "https://backend.woothealth.com/login/",
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
  await deleteSession();
  redirect("/login")
};