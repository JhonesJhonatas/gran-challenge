import { DataSource } from 'typeorm';

import { CompanyEntity } from '../entities/company.entity';
import { ProductEntity } from '../entities/product.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: process.env.DATABASE_URL ?? 'database.db',
        entities: [CompanyEntity, ProductEntity],
        synchronize: true,
      });
      return dataSource.initialize();
    },
  },
];
