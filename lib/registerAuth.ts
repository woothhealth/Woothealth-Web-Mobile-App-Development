"use server";

import axios from "axios";
import { api } from "@/lib/api/client";
import { registerSchema } from "@/lib/validator/register";
import { error } from "console";

// const API_UR = "http://localhost:3001";

// export const registerAction = async (formData: FormData) => {
//   try {
//     // 1️⃣ Convert FormData → plain object
//     const rawData = Object.fromEntries(formData.entries());

//     // 2️⃣ Server-side validation (MANDATORY)
//     const parsed = registerSchema.safeParse(rawData);

//     if (!parsed.success) {
//       return {
//         success: false,
//         errors: parsed.error.flatten().fieldErrors,
//       };
//     }

//     const data = parsed.data;

//     // 3️⃣ Check duplicate email
//     const emailRes = await axios.get(
//       `${API_UR}/users?email=${encodeURIComponent(data.email)}`
//     );

//     if (emailRes.data.length > 0) {
//       return {
//         success: false,
//         message: "Email already registered",
//         field: "email",
//       };
//     }

//     // 5️⃣ Create user (ONLY after all checks pass)
//     await axios.post(`${API_UR}/users`, {
//       firstName: data.firstName,
//       lastName: data.lastName,
//       phone: data.phoneNumber,
//       email: data.email,
//       password: data.password,
//       age: data.age,
//       address: data.address,
//       states: data.states,
//       role: "retail",
//     });

//     return { success: true };
//   } catch (error) {
//     return {
//       success: false,
//       message: "Registration failed",
//     };
//   }
// };


export const registerAction = async (formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());

  const sanitizedData = Object.fromEntries(
    Object.entries(rawData).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ])
  );

  const parsed = registerSchema.safeParse(sanitizedData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  
  try {
   const payload = {
     firstName: parsed.data.firstName.trim(),
     lastName: parsed.data.lastName.trim(),
     email: parsed.data.email.trim().toLowerCase(),
     phone: parsed.data.phoneNumber,
     locate: parsed.data.locate,
     address: parsed.data.address,
     age: parsed.data.age,
     password: parsed.data.password,
     role: "retail",
    };
    
    console.log("📤 Payload sent to backend 👉", payload);
    await api.post("/signup", payload, {
      headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }});
    
    return {
      success: true,
      message: "Registration successful. Please login.",
    };
  } catch (error: any) {
      console.error("REGISTER ACTION ERROR 👉", error);
      console.error("BACKEND RESPONSE 👉", error?.response?.data);
      console.error("STATUS 👉", error?.response?.status);
    return {
      success: false,
      message:
      error?.response?.data?.message || "Registration failed",
      field: error?.response?.data?.field,
    };
  }
};