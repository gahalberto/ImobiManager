import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../services/user";

export const createJWT = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET as string);
};

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ error: "Acesso negado" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (error, decoded: any) => {
      if (error) {
        res.status(401).json({ error: "Acesso negado" });
        return;
      }
      const user = await findUserByEmail(decoded.email);
      if (!user) {
        res.status(401).json({ error: "Acesso negado" });
        return;
      }

      next();
    }
  );
};
