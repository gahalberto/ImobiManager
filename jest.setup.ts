import "dotenv/config"; // Carrega variáveis de ambiente, se necessário
jest.spyOn(console, "error").mockImplementation(() => {});
