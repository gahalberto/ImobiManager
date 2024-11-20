import { AppDataSource } from "../data-source";
import { User } from "../infrastructure/entity/User";
import { z } from "zod";
import { signupSchema } from "../schemas/singup";

const userRepository = AppDataSource.getRepository(User);

// Definir o schema do zod para validar o corpo da solicitação
export const createUser = async (data: z.infer<typeof signupSchema>) => {
  const user = new User();
  user.firstName = data.firstName;
  user.lastName = data.lastname;
  user.email = data.email;
  user.password = data.password;

  await userRepository.save(user);
  return user;
};

export const findUserByEmail = async (email: string) => {
  return await userRepository.findOne({
    where: { email },
  });
};
