import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
} from "typeorm";
import { Property } from "./Property";

// Entidade Company
@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Atualize para ManyToMany, já que a relação é bidirecional
  @ManyToMany(() => Property, (property) => property.companies)
  properties!: Property[];
}
