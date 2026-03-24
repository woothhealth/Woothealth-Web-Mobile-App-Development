import { z } from "zod";

export const securitySchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
   })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SecurityFormInput = z.infer<typeof securitySchema>;