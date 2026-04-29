import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';

import { CompanyController } from './controllers/company.controller';
import { ProductController } from './controllers/product.controller';
import { AssociationController } from './controllers/association.controller';

import { CompanyService } from './services/company.service';
import { ProductService } from './services/product.service';
import { AssociationService } from './services/association.service';

import { CompanyRepository } from './repositories/company.repository';
import { ProductRepository } from './repositories/product.repository';
import { AssociationRepository } from './repositories/association.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyController, ProductController, AssociationController],
  providers: [
    CompanyService,
    ProductService,
    AssociationService,
    CompanyRepository,
    ProductRepository,
    AssociationRepository,
  ],
})
export class AppModule {}
