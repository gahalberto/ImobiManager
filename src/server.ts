import "reflect-metadata";
import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import mainRouter from "./routers/main";
import { AppDataSource } from "./data-source";

// Iniciando configuração do TypeORM
AppDataSource.initialize()
  .then(async () => {
    // Configurações do servidor
    const server = express();
    // Adicione o Helmet ao seu aplicativo
    server.use(helmet());
    server.use(cors());
    server.use(urlencoded({ extended: true }));
    server.use(express.json());

    // Suas rotas aqui
    server.use(mainRouter);

    server.listen(process.env.PORT || 3000, () => {
      console.log(`🚀🚀 SERVIDOR RODANDO EM ${process.env.BASE_URL}`);
    });
  })
  .catch((error) => console.log(error));
