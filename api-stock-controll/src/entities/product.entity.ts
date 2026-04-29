import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CompanyEntity } from './company.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true, nullable: true })
  barcode!: string;

  @Column()
  description!: string;

  @Column({ default: 0 })
  stock_quantity!: number;

  @Column()
  category!: string;

  @Column({ type: 'date', nullable: true })
  expiration_date!: Date;

  @Column({ nullable: true })
  image!: string;

  @ManyToMany(() => CompanyEntity, (company) => company.products)
  @JoinTable({ name: 'product_company' })
  companies!: CompanyEntity[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
