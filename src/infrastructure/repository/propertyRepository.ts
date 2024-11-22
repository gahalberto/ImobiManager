import { AppDataSource } from "../../data-source";
import { Property } from "../entity/Property";

export const propertyRepository = AppDataSource.getRepository(Property);
