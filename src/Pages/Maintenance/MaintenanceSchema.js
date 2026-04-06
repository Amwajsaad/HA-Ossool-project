import { z } from "zod";

export const maintenanceSchema = z.object({
  asset: z
    .string()
    .min(2, "Asset name must be at least 2 characters")
    .trim(),

  date: z
    .string()
    .min(1, "Date is required"),

  cost: z
    .string()
    .min(1, "Cost is required")
    .regex(/^\$?\d+(\.\d+)?$/, "Enter a valid cost like 120 or $120"),

  status: z.enum(["Completed", "Pending", "In Progress"]),
});