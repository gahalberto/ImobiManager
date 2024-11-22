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
      (getPropertiesByFilter as jest.Mock).mockResolvedValue([
        { id: 1, title: "Property A" },
        { id: 2, title: "Property B" },
      ]);

      req.query = {
        price_min: "1000",
        price_max: "2000",
        bedrooms: "3",
        bathrooms: "2",
        address_city: "City",
      };

      await filterProperties(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([
        { id: 1, title: "Property A" },
        { id: 2, title: "Property B" },
      ]);
    });
  });

  describe("CreateProperty", () => {
    it("should return 500 if validation fails", async () => {
      // Mock de validação ZodError para falha de validação
      const zodError = new Error("Validation failed");
      (createProperty as jest.Mock).mockRejectedValue(zodError);

      req.body = { title: "" }; // Dados inválidos
      await Create(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error creating property",
        message: expect.any(Error),
      });
    });

    it("should return 500 if CreateProperty fails", async () => {
      (createProperty as jest.Mock).mockRejectedValue(
        new Error("Error creating property")
      );

      req.body = { title: "New Property" };
      await Create(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error creating property",
        message: expect.any(Error),
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
        companies: [1, 2],
      };

      await Create(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ id: 1, title: "New Property" });
    });
  });

  describe("Update Property", () => {
    it("should return 500 if validation fails", async () => {
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
        new Error("Error updating property")
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
        new Error("Error deleting property")
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
