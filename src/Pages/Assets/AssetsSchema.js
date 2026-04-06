import { z } from "zod";

export const assetsSchema = z.object({
  name: z
    .string()
    .min(2, "Asset name must be at least 2 characters."),

  category: z
    .string()
    .min(1, "Category is required."),

  serialNumber: z
    .string()
    .min(3, "Serial number must be at least 3 characters."),

  purchaseDate: z
    .string()
    .min(1, "Purchase date is required."),

  status: z.enum(["Available", "Assigned", "Maintenance"]),
});