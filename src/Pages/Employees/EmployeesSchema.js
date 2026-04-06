import { z } from "zod";

export const employeesSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .trim(),

  department: z
    .string()
    .min(1, "Department is required.")
    .trim(),

  phone: z
    .string()
    .min(1, "Phone is required.")
    .regex(/^05\d{8}$/, "Phone must start with 05 and be 10 digits."),

  asset: z
    .string()
    .min(1, "Assigned asset is required.")
    .trim(),

  branch: z
    .string()
    .min(1, "Branch is required.")
    .trim(),

  status: z.enum(["Active", "Inactive"]),
});