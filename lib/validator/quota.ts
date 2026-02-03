import { check, z } from "zod";

export const quotaSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid Phone number"),

    email: z.string().email("Invalid email"),

    company: z.string().min(1, "Company is required"),
    companyAddress: z.string().min(5, "Company Address is required"),
    employeeNumber: z.string().min(1, "Age range is required"),
    locate: z.string().min(1, "State is required"),
    message: z.string().min(1, "Message is required"),
    check: z.preprocess((val) => val === "on" || val === true,
      z.boolean().refine((val) => val === true, {
      message: "You must accept the privacy policy",
    })
    ),
  })
  

export type QuotaFormInput = z.infer<typeof quotaSchema>;