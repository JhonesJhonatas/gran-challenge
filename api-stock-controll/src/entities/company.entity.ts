import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductEntity } from './product.entity';

@Entity('company')
export class CompanyEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  cnpj!: string;

  @Column()
  address!: string;

  @Column()
  phone_number!: string;

  @Column()
  email!: string;

  @Column()
  main_contact!: string;

  @ManyToMany(() => ProductEntity, (product) => product.companies)
  products!: ProductEntity[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
