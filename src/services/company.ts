import { Company } from "../infrastructure/entity/Company";
import { companyRepository } from "../infrastructure/repository/companyRepository";
import { In } from "typeorm";

// Buscar todas as construtoras
export const getAllCompanies = async () => {
  try {
    const companies = await companyRepository.find();
    return companies;
  } catch (error) {
    console.error("Erro ao buscar construtora:", error);
    throw error;
  }
};

// Criar uma construtora de imóveis
export const CreateCompany = async (name: string) => {
  const company = new Company();
  company.name = name;
  const newCompany = await companyRepository.save(company);

  return newCompany;
};

export const getCompaniesByIds = async (ids: number[]) => {
  return await companyRepository.find({
    where: {
      id: In(ids),
    },
  });
};
