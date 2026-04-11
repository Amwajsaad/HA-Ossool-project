import { z } from "zod";

export const assetsSchema = z.object({
  name: z
    .string()
    .min(2, "Asset name must be at least 2 characters."),

  storageId: z
    .string()
    .min(1, "Storage is required."),

  productTypeId: z
    .string()
    .min(1, "Product type is required."),
});