import { z } from "zod";

export const companySchema = z.object({
  name: z.string(),
});
