import {
  getAllCompanies,
  CreateCompany,
  getCompaniesByIds,
} from "../services/company";
import { companyRepository } from "../infrastructure/repository/companyRepository";
import { Company } from "../infrastructure/entity/Company";
import { In } from "typeorm";

jest.mock("../infrastructure/repository/companyRepository", () => ({
  companyRepository: {
    find: jest.fn(),
    save: jest.fn(),
  },
}));

describe("Company Service", () => {
  afterEach(() => jest.clearAllMocks());

  describe("getAllCompanies", () => {
    it("should return all companies", async () => {
      const mockCompanies = [
        { id: 1, name: "Company A" },
        { id: 2, name: "Company B" },
      ];
      (companyRepository.find as jest.Mock).mockResolvedValue(mockCompanies);

      const result = await getAllCompanies();

      expect(companyRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockCompanies);
    });

    it("should throw an error if repository fails", async () => {
      (companyRepository.find as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(getAllCompanies()).rejects.toThrow("Database error");
    });
  });

  describe("CreateCompany", () => {
    it("should create and return a new company", async () => {
      const mockCompany = { id: 1, name: "New Company" } as Company;
      (companyRepository.save as jest.Mock).mockResolvedValue(mockCompany);

      const result = await CreateCompany("New Company");

      expect(companyRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: "New Company" })
      );
      expect(result).toEqual(mockCompany);
    });

    it("should throw an error if save fails", async () => {
      (companyRepository.save as jest.Mock).mockRejectedValue(
        new Error("Save error")
      );

      await expect(CreateCompany("New Company")).rejects.toThrow("Save error");
    });
  });

  describe("getCompaniesByIds", () => {
    it("should return companies by IDs", async () => {
      const mockCompanies = [
        { id: 1, name: "Company A" },
        { id: 2, name: "Company B" },
      ];
      (companyRepository.find as jest.Mock).mockResolvedValue(mockCompanies);

      const result = await getCompaniesByIds([1, 2]);

      expect(companyRepository.find).toHaveBeenCalledWith({
        where: {
          id: In([1, 2]),
        },
      });
      expect(result).toEqual(mockCompanies);
    });

    it("should throw an error if repository fails", async () => {
      (companyRepository.find as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(getCompaniesByIds([1, 2])).rejects.toThrow("Database error");
    });
  });
});
