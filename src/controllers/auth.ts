import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/user";
import { signupSchema } from "../schemas/singup";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";
import bcrypt from "bcrypt"; // Alterado para importar diretamente o bcrypt

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

  const hashPassword = await bcrypt.hash(safeData.data.password, 10);

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

export const signin = async (req: Request, res: Response): Promise<any> => {
  const safeData = signinSchema.safeParse(req.body);
  if (!safeData.success) {
    return res
      .status(400)
      .json({ error: safeData.error.flatten().fieldErrors });
  }

  // Verifica se o usuário existe pelo email
  const user = await findUserByEmail(safeData.data.email);
  if (!user) {
    return res.status(400).json({ error: "Usuário não encontrado" });
  }

  // Compara a senha
  const passwordMatch = await bcrypt.compare(
    safeData.data.password,
    user.password
  );

  // Se a senha não bater, retorna erro de acesso negado e não senha invalida para não dar dica ao usuário
  if (!passwordMatch) {
    return res.status(400).json({ error: "Acesso negado" });
  }

  // Cria o token JWT
  const token = createJWT(user.email);
  res.json({ token, user: { firstName: user.firstName, email: user.email } });
};
