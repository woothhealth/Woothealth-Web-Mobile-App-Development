import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().min(10, "Phone number is required"),
    email: z.string().email("Invalid email"),
    state: z.string().min(1, "State is required"),
    address: z.string().min(1, "Address is required"),
    age: z.string().min(1, "Age range is required"), // STRING (important)
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    check: z.preprocess((val) => val === "on" || val === true,
      z.boolean().refine((val) => val === true, {
      message: "You must accept the privacy policy",
    })
    ),
  })

  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
