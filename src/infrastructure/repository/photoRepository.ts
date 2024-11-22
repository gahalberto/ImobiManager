import { AppDataSource } from "../../data-source";
import { Photos } from "../entity/Photos";

export const photoRepository = AppDataSource.getRepository(Photos);
