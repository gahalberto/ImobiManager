import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
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

  @OneToMany(() => Property, (property) => property.company)
  properties!: Property[];
}
