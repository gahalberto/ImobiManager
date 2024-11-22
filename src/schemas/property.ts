import { z } from "zod";

export const propertySchema = z.object({
  title: z.string(),
  companies: z.array(z.number()),
  address_zipcode: z.string(),
  address_street: z.string(),
  address_number: z.string(),
  address_complement: z.string(),
  address_neighborhood: z.string(),
  address_city: z.string(),
  address_state: z.string(),
  price: z.number(),
  description: z.string(),
  images: z.array(z.string()).optional(),
  bedrooms: z.number(),
  bathrooms: z.number(),
});
