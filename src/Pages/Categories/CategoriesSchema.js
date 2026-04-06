import { z } from "zod";

export const categoriesSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .trim(),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .trim(),

  assetsCount: z
    .string()
    .min(1, "Assets count is required")
    .refine((value) => Number(value) >= 0, {
      message: "Assets count must be 0 or more.",
    }),

  status: z.enum(["Active", "Inactive"]),
});