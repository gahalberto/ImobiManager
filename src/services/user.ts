import { AppDataSource } from "../data-source";
import { User } from "../infrastructure/entity/User";

const userRepository = AppDataSource.getRepository(User);

type UserProps = {
  firstName: string;
  lastname: string;
  email: string;
  password: string;
};

// Definir o schema do zod para validar o corpo da solicitação
export const createUser = async (data: UserProps) => {
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
