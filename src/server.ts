import express, { Application } from "express";
import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import mainRouter from "./routers/main";
import { AppDataSource } from "./data-source";

// Tipo explicito de Application do Express
const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas da aplicação
app.use(mainRouter);

// Função para iniciar o servidor e retornar a instância do servidor HTTP
export const startServer = () => {
  return AppDataSource.initialize()
    .then(() => {
      const port = process.env.PORT || 3333;
      const server = app.listen(port, () => {
        console.log(`✅ Servidor rodando na porta ${port} 🚀`);
      });
      return server; // Retorna a instância do servidor HTTP
    })
    .catch((error) => {
      console.error("Erro ao iniciar o servidor:", error);
      process.exit(1); // Encerra o processo em caso de erro
    });
};

startServer();

// Exporta a função de startServer para iniciar o servidor em outro lugar
export default app; // Exporta o app, caso precise usá-lo em outro lugar
