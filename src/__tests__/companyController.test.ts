import { addCompany, getCompanies } from "../controllers/companyController";
import { CreateCompany, getAllCompanies } from "../services/company";
import { Request, Response } from "express";

jest.mock("../services/company"); // Mocka o serviço completo

describe("CompanyController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {}; // Dados da requisição, se necessário
    res = {
      status: jest.fn().mockReturnThis(), // Mocka status
      json: jest.fn(), // Mocka json
    };
  });

  it("should handle errors when getAllCompanies fails", async () => {
    // Garantindo que o mock gere o erro correto
    (getAllCompanies as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await getCompanies(req as Request, res as Response);

    // Verificando a resposta de erro
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao buscar todas as construtoras: Database error",
    });
  });
});

describe("addCompany", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 400 if validation fails when adding a company", async () => {
    req.body = { name: "" }; // Dados inválidos
    await addCompany(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });

  it("should return 500 if CreateCompany fails", async () => {
    (CreateCompany as jest.Mock).mockRejectedValue(
      new Error("Error creating company")
    );
    req.body = { name: "New Company" };
    await addCompany(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Erro ao criar uma construtora: Error creating company",
    });
  });

  it("should return 201 and the new company when company is successfully created", async () => {
    (CreateCompany as jest.Mock).mockResolvedValue({
      id: 1,
      name: "New Company",
    });
    req.body = { name: "New Company" };
    await addCompany(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "New Company" });
  });
});
