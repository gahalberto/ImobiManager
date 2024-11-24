import { z } from "zod";

export const updatePropertySchema = z.object({
  title: z.string().optional(),
  companies: z.array(z.number()).optional(),
  address_zipcode: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.number().optional(),
  address_complement: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
});
