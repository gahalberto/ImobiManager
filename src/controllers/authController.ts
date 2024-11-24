import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/user";
import { signupSchema } from "../schemas/singup";
import { createJWT } from "../utils/jwt";
import { signinSchema } from "../schemas/signin";
import bcrypt from "bcrypt"; // Alterado para importar diretamente o bcrypt

// Função de cadastro de usuário

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validação do corpo da requisição com ZOD (signupSchema)
    const safeData = signupSchema.safeParse(req.body);

    // Se a validação falhar, retorna erro 400 com a mensagem de erro
    if (!safeData.success) {
      return res
        .status(400)
        .json({ error: safeData.error.flatten().fieldErrors });
    }

    // Verifica se o email já existe
    const hasEmail = await findUserByEmail(safeData.data.email);
    if (hasEmail) {
      return res.status(400).json({ error: "E-mail já existe" });
    }

    // Criptografa a senha usando bcrypt
    const hashPassword = await bcrypt.hash(safeData.data.password, 10);

    // Cria o usuário usando service CreateUser
    const newUser = await createUser({
      firstName: safeData.data.firstName,
      lastname: safeData.data.lastname,
      email: safeData.data.email,
      password: hashPassword,
    });

    // Cria o token JWT
    const token = createJWT(newUser.email);

    // Retorna o token e o alguns dados do usuário
    res.status(201).json({
      token,
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Aconteceu algum erro ao criar usuário" });
  }
};

// Função de login
export const signin = async (req: Request, res: Response): Promise<any> => {
  try {
    // Validação do corpo da requisição com ZOD (signinSchema)
    const safeData = signinSchema.safeParse(req.body);
    // Se a validação falhar, retorna erro 400 com a mensagem de erro
    if (!safeData.success) {
      return res
        .status(400)
        .json({ error: safeData.error.flatten().fieldErrors });
    }

    // Verifica se o usuário existe pelo email
    const user = await findUserByEmail(safeData.data.email);
    if (!user) {
      return res.status(400).json({ error: "E-mail e/ou senha inválidos" });
    }

    // Compara a senha criptografada com a senha do usuário usando bcrypt
    const passwordMatch = await bcrypt.compare(
      safeData.data.password,
      user.password
    );

    // Se a senha não bater, retorna erro de acesso negado e não senha invalida para não dar dica ao usuário
    if (!passwordMatch) {
      return res.status(400).json({ error: "E-mail e/ou senha inválidos" });
    }

    // Cria o token JWT, retornando o token e alguns dados do usuário
    const token = createJWT(user.email);
    res.json({ token, user: { firstName: user.firstName, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Aconteceu algum erro ao fazer login" });
  }
};
