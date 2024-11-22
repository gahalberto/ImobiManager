import { AppDataSource } from "../../data-source";
import { Company } from "../entity/Company";

export const companyRepository = AppDataSource.getRepository(Company);
