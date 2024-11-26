import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { Company } from "./Company";
import { Photos } from "./Photos";

// Entidade Property
@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  title!: string;

  @Column({ type: "varchar", length: 100 })
  address_zipcode!: string;

  @Column({ type: "varchar", length: 100 })
  address_street!: string;

  @Column({ type: "varchar", length: 100 })
  address_city!: string;

  @Column({ type: "varchar", length: 100 })
  address_number!: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  address_complement!: string;

  @Column({ type: "varchar", length: 100 })
  address_state!: string;

  @Column({ type: "varchar", length: 100 })
  address_neighborhood!: string;

  @Column({ type: "decimal" })
  price!: number;

  @Column({ type: "int" })
  bedrooms!: number;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "int" })
  bathrooms!: number;

  @ManyToOne(() => Company, (company) => company.properties)
  company!: Company;

  @OneToMany(() => Photos, (photos) => photos.property)
  photos!: Photos[];
}
