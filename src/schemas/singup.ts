import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().nonempty(),
    lastname: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6),
    confirm: z.string(),
  })
  .refine(
    (value) => {
      return value.password === value.confirm;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirm"],
    }
  );
