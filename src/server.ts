import express, { Application } from "express"; // Importando Application do express
import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import mainRouter from "./routers/main";
import { AppDataSource } from "./data-source";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("../swagger.json");

const options = {
  explorer: true,
  customCss: ".swagger-ui .topbar { display: none }",
};

// Tipo explicito de Application do Express
const server: Application = express();

server.use(helmet());
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

// Rotas da aplicação
server.use(mainRouter);
// Rota para documentação
server.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);

// Inicia o servidor
export const startServer = () => {
  AppDataSource.initialize()
    .then(() => {
      const port = process.env.PORT || 3000;
      server.listen(port, () => {
        console.log(`✅ Servidor rodando na porta ${port} 🚀`);
      });
    })
    .catch((error) => console.log(error));
};

startServer();

export default server;
