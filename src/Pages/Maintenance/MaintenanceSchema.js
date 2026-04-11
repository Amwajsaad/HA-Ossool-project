import { z } from "zod";

export const maintenanceSchema = z.object({
  date: z
    .string()
    .min(1, "Date is required"),

  cost: z
    .string()
    .min(1, "Cost is required")
    .regex(/^\$?\d+(\.\d+)?$/, "Enter a valid cost like 120 or $120"),

  status: z.enum(["Completed", "Pending", "In Progress"]),

  productId: z
    .string()
    .min(1, "Product is required"),
});