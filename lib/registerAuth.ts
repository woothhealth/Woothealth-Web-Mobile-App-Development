import axios from "axios";
import { registerSchema } from "@/lib/validator/register";

const API_UR = "http://localhost:3001";

export const registerAction = async (formData: FormData) => {
  try {
    // 1️⃣ Convert FormData → plain object
    const rawData = Object.fromEntries(formData.entries());

    // 2️⃣ Server-side validation (MANDATORY)
    const parsed = registerSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    // 3️⃣ Check duplicate email
    const emailRes = await axios.get(
      `${API_UR}/users?email=${encodeURIComponent(data.email)}`
    );

    if (emailRes.data.length > 0) {
      return {
        success: false,
        message: "Email already registered",
        field: "email",
      };
    }

    // 5️⃣ Create user (ONLY after all checks pass)
    await axios.post(`${API_UR}/users`, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: data.password,
      age: data.age,
      address: data.address,
      state: data.state,
      role: "retail",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "Registration failed",
    };
  }
};