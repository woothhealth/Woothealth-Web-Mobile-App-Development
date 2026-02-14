import { api } from "./client";
import axios from "axios";

// export const getUserById = async (id: string) => {
//   try {
//     // Use the NEXT_PUBLIC_API_URL or BACKEND_URL env var here
//     const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
//     const res = await axios.get(`${BACKEND_URL}/profile/`, {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error: any) {
//     return null;
//   }
// };

export const getUserById = async (id: string) => {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
    if (!BACKEND_URL) throw new Error('Backend URL not configured');

    const res = await axios.get(`${BACKEND_URL}/profile/`, {
      withCredentials: true, // uses cookies
    });
    return res.data; // { firstName, lastName, email, ... }
  } catch (error: any) {
    console.error("Failed to fetch user:", error.message);
    return null;
  }
};


export const getUserByEmail = async (email: string) => {
  const res = await api.get(`/profile/`);
  return res.data[0];
};