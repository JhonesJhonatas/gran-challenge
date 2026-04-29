import { DataSource } from 'typeorm';

import { CompanyEntity } from '../entities/company.entity';
import { ProductEntity } from '../entities/product.entity';

export const entitiesProviders = [
  {
    provide: 'COMPANY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CompanyEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProductEntity),
    inject: ['DATA_SOURCE'],
  },
];
