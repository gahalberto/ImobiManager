import { Request, Response } from "express";
import {
  createProperty,
  deleteProperty,
  getPropertiesByFilter,
  updateProperty,
} from "../services/property";
import {
  filterProperties,
  Create,
  Update,
  Remove,
} from "../controllers/propertyController";

jest.mock("./../services/property");

const req = {
  query: {},
  body: {},
  params: {},
  files: [],
} as Partial<Request>;

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;

const statusMock = res.status as jest.Mock;
const jsonMock = res.json as jest.Mock;

describe("Property Controller", () => {
  afterEach(() => jest.clearAllMocks());

  describe("filterProperties", () => {
    it("should return 200 with filtered properties", async () => {
      (getPropertiesByFilter as jest.Mock).mockResolvedValue({
        properties: [
          { id: 1, title: "Property A" },
          { id: 2, title: "Property B" },
        ],
        totalProperties: 2,
      });

      req.query = {
        price_min: "1000",
        price_max: "2000",
        bedrooms: "3",
        bathrooms: "2",
        address_city: "City",
        page: "1",
        limit: "1",
      };

      await filterProperties(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        properties: [
          { id: 1, title: "Property A" },
          { id: 2, title: "Property B" },
        ],
        totalProperties: 2,
        totalPages: 2,
        currentPage: 1,
      });
    });
  });

  describe("CreateProperty", () => {
    it("should return 400 if validation fails", async () => {
      const zodError = new Error("Nenhum arquivo foi enviado.");
      (createProperty as jest.Mock).mockRejectedValue(zodError);

      req.body = { title: "" }; // Dados inválidos
      await Create(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Nenhum arquivo foi enviado.",
      });
    });

    it("should return 500 if CreateProperty fails", async () => {
      (createProperty as jest.Mock).mockRejectedValue(
        new Error("Error creating property")
      );

      req.body = { title: "New Property" };
      await Create(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Nenhum arquivo foi enviado.",
      });
    });

    it("should return 201 and the new property when property is successfully created", async () => {
      (createProperty as jest.Mock).mockResolvedValue({
        id: 1,
        title: "New Property",
      });

      req.body = {
        title: "Apartamento Luxo no Centro",
        address_zipcode: "12345-678",
        address_street: "Rua das Palmeiras",
        address_number: "123",
        address_complement: "Apto 501",
        address_neighborhood: "Centro",
        address_city: "São Paulo",
        address_state: "SP",
        price: 850000.0,
        description:
          "Apartamento de alto padrão, localizado no centro da cidade, com vista panorâmica e infraestrutura completa.",
        bedrooms: 3,
        bathrooms: 2,
        company: 1,
      };
      req.files = [
        {
          path: "uploads/fake-image.jpg",
          filename: "fake-image.jpg",
          mimetype: "image/jpeg",
        } as Express.Multer.File,
      ];

      await Create(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Imóvel criado com sucesso!",
        property: { id: 1, title: "New Property" },
      });
    });
  });

  describe("Update Property", () => {
    it("should return 400 if validation fails", async () => {
      const zodError = new Error("Validation failed");
      (updateProperty as jest.Mock).mockRejectedValue(zodError);

      req.params = { id: "1" };
      req.body = { title: "" }; // Dados inválidos
      await Update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao atualizar um imóvel.",
      });
    });

    it("should return 500 if updateProperty service fails", async () => {
      (updateProperty as jest.Mock).mockRejectedValue(
        new Error("Erro ao atualizar um imóvel.")
      );

      req.params = { id: "1" };
      req.body = { title: "Updated Title" };
      await Update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao atualizar um imóvel.",
      });
    });

    it("should return 200 and the updated property", async () => {
      (updateProperty as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Updated Title",
      });

      req.params = { id: "1" };
      req.body = { title: "Updated Title" };

      await Update(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        title: "Updated Title",
      });
    });
  });

  describe("Remove Property", () => {
    it("should return 500 if deleteProperty service fails", async () => {
      (deleteProperty as jest.Mock).mockRejectedValue(
        new Error("Erro ao remover um imóvel.")
      );

      req.params = { id: "1" };
      await Remove(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao remover um imóvel.",
      });
    });

    it("should return 200 and the removed property", async () => {
      (deleteProperty as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Property to Remove",
      });

      req.params = { id: "1" };
      await Remove(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        title: "Property to Remove",
      });
    });
  });
});
