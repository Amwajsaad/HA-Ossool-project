import { z } from "zod";

export const departmentsSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required.")
    .trim(),

  manager: z
    .string()
    .min(1, "Manager name is required.")
    .trim(),

  employees: z
    .string()
    .min(1, "Employees count is required.")
    .refine((value) => Number(value) >= 0, {
      message: "Employees count must be 0 or more.",
    }),

  assets: z
    .string()
    .min(1, "Assets count is required.")
    .refine((value) => Number(value) >= 0, {
      message: "Assets count must be 0 or more.",
    }),

  location: z
    .string()
    .min(1, "Location is required.")
    .trim(),
});