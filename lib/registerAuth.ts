"use server";

// import axios from "axios";
// import { api } from "@/lib/api/client";
// import { registerSchema } from "@/lib/validator/register";
// import { error } from "console";
// import { RegisterPayload } from "./payload";

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

// 

// registerAction.ts
import axios from "axios";
import { registerSchema } from "@/lib/validator/register";

export async function registerAction(rawData: unknown) {
  const parsed = registerSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Strip fields NOT meant for backend
  const {
    confirmPassword,
    check,
    ...payload
  } = parsed.data;

  try {
    const response = await axios.post(
      "https://backend.woothealth.com/signup/",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    if (response.status === 201) {
      return {
        success: true,
        message: response.data?.message ?? "Account created",
      };
    }

    return {
      success: false,
      message: response.data?.error ?? "Sign up failed",
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}