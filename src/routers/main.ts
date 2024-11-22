import express from "express";
import { signin, signup } from "../controllers/authController";
import { ping } from "../controllers/pingController";
import * as PropertyController from "../controllers/propertyController";
import * as CompanyController from "../controllers/companyController";
import { verifyJWT } from "../utils/jwt";

const router = express.Router();

// Documentação

router.get("/ping", ping);

// Rotas de Auth
router.post("/signup", signup);
router.post("/signin", signin);

// Rotas CRUD de Propriedades - VerifyJWT é um middleware que verifica se o token é válido
router.post("/properties", PropertyController.Create);

// Company routes
router.get("/company", verifyJWT, CompanyController.getCompanies);
router.post("/company", verifyJWT, CompanyController.addCompany);
export default router;
