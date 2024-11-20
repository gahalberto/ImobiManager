import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/user";
import { signupSchema } from "../schemas/singup";
import { compare, hash } from "bcrypt-ts";
import { createJWT } from "../utils/jwt";

export const signup = async (req: Request, res: Response): Promise<any> => {
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    return res
      .status(400)
      .json({ error: safeData.error.flatten().fieldErrors });
  }

  const hasEmail = await findUserByEmail(safeData.data.email);
  if (hasEmail) {
    return res.status(400).json({ error: "E-mail já existe" });
  }

  const hashPassword = await hash(safeData.data.password, 10);

  const newUser = await createUser({
    firstName: safeData.data.firstName,
    lastname: safeData.data.lastname,
    email: safeData.data.email,
    password: hashPassword,
  });

  // Cria o token JWT
  const token = createJWT(newUser.email);

  // Retorna o token e o usuário
  res.status(201).json({
    token,
    user: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    },
  });
};
