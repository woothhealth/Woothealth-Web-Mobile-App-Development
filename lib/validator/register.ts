import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid Phone number"),
    email: z.string().email("Invalid email"),
    locate: z.string().min(1, "State is required"),
    address: z.string().min(1, "Address is required"),
    age: z.string().min(1, "Age range is required"), // STRING (important)
    password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Password must include an uppercase letter, lowercase letter, and a number"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
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
