import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./infrastructure/entity/User";
import dotenv from "dotenv";
import { Company } from "./infrastructure/entity/Company";
import { Property } from "./infrastructure/entity/Property";
import { Photos } from "./infrastructure/entity/Photos";

dotenv.config();
console.log("DataSource configurado com sucesso!");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Company, Property, Photos],
  migrations: ["src/infrastructure/migrations/**/*.ts"],
  migrationsTableName: "1732279961954-UpdatingProperty",
  subscribers: [],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
