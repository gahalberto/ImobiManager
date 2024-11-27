import { createUser, findUserByEmail } from "../services/user";
import { signupSchema } from "../schemas/singup";
import { signinSchema } from "../schemas/signin";
import { createJWT } from "../utils/jwt";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { signin, signup } from "../controllers/authController";

jest.mock("../services/user");
jest.mock("../schemas/singup");
jest.mock("../schemas/signin");
jest.mock("../utils/jwt");
jest.mock("bcrypt");

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = { status: statusMock, json: jsonMock };
  });

  describe("signup", () => {
    it("should return 400 if validation fails", async () => {
      (signupSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: "error" }) },
      });

      await signup(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "error" });
    });

    it("should return 400 if email already exists", async () => {
      (signupSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: { email: "test@test.com" },
      });
      (findUserByEmail as jest.Mock).mockResolvedValue(true);

      await signup(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "E-mail já existe" });
    });

    it("should create user and return token", async () => {
      (signupSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: {
          email: "test@test.com",
          password: "password",
          firstName: "John",
          lastname: "Doe",
        },
      });
      (findUserByEmail as jest.Mock).mockResolvedValue(false);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (createUser as jest.Mock).mockResolvedValue({
        email: "test@test.com",
        firstName: "John",
        lastName: "Doe",
      });
      (createJWT as jest.Mock).mockReturnValue("token");

      await signup(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        token: "token",
        user: { firstName: "John", lastName: "Doe", email: "test@test.com" },
      });
    });
  });

  describe("signin", () => {
    it("should return 400 if validation fails", async () => {
      (signinSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { flatten: () => ({ fieldErrors: "error" }) },
      });

      await signin(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: "error" });
    });

    it("should return 400 if user not found", async () => {
      (signinSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: { email: "test@test.com" },
      });
      (findUserByEmail as jest.Mock).mockResolvedValue(null);

      await signin(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Usuário não encontrado",
      });
    });

    it("should return 400 if password does not match", async () => {
      (signinSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: { email: "test@test.com", password: "password" },
      });
      (findUserByEmail as jest.Mock).mockResolvedValue({
        email: "test@test.com",
        password: "hashedPassword",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await signin(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "E-mail e/ou senha inválidos",
      });
    });

    it("should return token if signin is successful", async () => {
      (signinSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: { email: "test@test.com", password: "password" },
      });
      (findUserByEmail as jest.Mock).mockResolvedValue({
        email: "test@test.com",
        password: "hashedPassword",
        firstName: "John",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (createJWT as jest.Mock).mockReturnValue("token");

      await signin(req as Request, res as Response);

      expect(jsonMock).toHaveBeenCalledWith({
        token: "token",
        user: { firstName: "John", email: "test@test.com" },
      });
    });
  });
});
