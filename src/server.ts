import express, { Application } from "express";
import "reflect-metadata";
import cors from "cors";
import helmet from "helmet";
import mainRouter from "./routers/main";
import { AppDataSource } from "./data-source";
import path from "path";

// Tipo explicito de Application do Express
const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// Rotas da aplicação
app.use(mainRouter);
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Verifique o caminho real da pasta 'uploads'
console.log("Caminho para a pasta uploads:", path.join(__dirname, "uploads"));

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
