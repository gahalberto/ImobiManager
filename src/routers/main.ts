import express from "express";
import { signin, signup } from "../controllers/authController";
import { ping } from "../controllers/pingController";
import * as PropertyController from "../controllers/propertyController";
import * as CompanyController from "../controllers/companyController";
import { verifyJWT } from "../utils/jwt";
import upload from "../utils/upload";

const router = express.Router();

// Documentação

router.get("/ping", ping);

// Rotas de Auth
router.post("/signup", signup);
router.post("/signin", signin);

// Rotas CRUD de Propriedades - VerifyJWT é um middleware que verifica se o token é válido
router.get("/properties", PropertyController.filterProperties);
router.get("/properties/:id", PropertyController.getProperty);
router.post(
  "/properties",
  verifyJWT,
  upload.array("images", 10),
  PropertyController.Create
);
router.put("/properties/:id", verifyJWT, PropertyController.Update);
router.delete("/properties/:id", verifyJWT, PropertyController.Remove);

// Company routes
router.get("/company", CompanyController.getCompanies);
router.post("/company", verifyJWT, CompanyController.addCompany);
export default router;
