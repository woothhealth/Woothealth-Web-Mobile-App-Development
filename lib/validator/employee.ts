import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  department: z.string().min(1, "Department is required"),
  gender: z.string().min(1, "Please select a gender"),
  plan: z.string().min(1, "Please select a plan"),
  status: z.enum(["active", "inactive"], "Please select a status"),
});

export type EmployeeFormInput = z.infer<typeof employeeSchema>;