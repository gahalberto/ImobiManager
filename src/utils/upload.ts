import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

// Definindo o tipo para a callback do multer
type MulterCallback = (error: Error | null, destination: string) => void;

// Configuração de armazenamento com tipagem
const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: MulterCallback
  ) => {
    cb(null, "uploads/photos/"); // Pasta onde os arquivos serão armazenados
  },
  filename: (req: Request, file: Express.Multer.File, cb: MulterCallback) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nome único baseado no timestamp
  },
});

// Configuração do multer
const upload = multer({ storage });

export default upload;
