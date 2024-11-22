import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property";

// Entidade Photos
@Entity()
export class Photos {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Property, (property) => property.photos)
  property!: Property;

  @Column({ type: "varchar", length: 255 })
  filePath!: string;
}
