import express from "express";
import { signin, signup } from "../controllers/auth";
import { ping } from "../controllers/ping";
import * as PropertyController from "../controllers/property";
import { verifyJWT } from "../utils/jwt";

const router = express.Router();

// Documentação

router.get("/ping", ping);

// Rotas de Auth
router.post("/signup", signup);
router.post("/signin", signin);

// Rotas CRUD de Propriedades - VerifyJWT é um middleware que verifica se o token é válido
router.post("/properties", verifyJWT, PropertyController.Create);

export default router;
