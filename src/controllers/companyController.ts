import { Request, Response } from "express";
import { companyRepository } from "../infrastructure/repository/companyRepository";
import { companySchema } from "../schemas/company";
import { CreateCompany, getAllCompanies } from "../services/company";

// Controller para rota de buscar todas as construtoras
// O nome da tabelta da construtora é "Company"
export const getCompanies = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const companies = await getAllCompanies();
    res.json(companies);
  } catch (error) {
    console.error("Erro ao buscar todas as construtoras:", error);
    throw error;
  }
};

// Controller para rota de criar nova construtora
// O nome da tabelta da construtora é "Company"
export const addCompany = async (req: Request, res: Response): Promise<any> => {
  const safeData = companySchema.safeParse(req.body);
  if (!safeData.success) {
    return res.status(400).json(safeData.error);
  }

  const newCompany = await CreateCompany(safeData.data.name);
  if (!newCompany) {
    return res.status(500).json({ error: "Erro ao criar uma construtora" });
  }
  // Retorna a nova construtora criada
  res.status(201).json(newCompany);
};
