import { api } from "./client";
import axios from "axios";

// export const getUserById = async (id: string) => {
//   try {
//     const res = await axios.get(`https://backend.woothealth.com/profile/`, {
//       withCredentials: true,
//     });
//     return res.data;
//   } catch (error: any) {
//     return null;
//   }
// };

export const getUserById = async (id: string) => {
  try {
    const res = await axios.get(`https://backend.woothealth.com/profile/`, {
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