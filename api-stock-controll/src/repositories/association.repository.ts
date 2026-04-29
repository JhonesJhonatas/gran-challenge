import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProductEntity } from '../entities/product.entity';
import { CompanyEntity } from '../entities/company.entity';

@Injectable()
export class AssociationRepository {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepo: Repository<ProductEntity>,
    @Inject('COMPANY_REPOSITORY')
    private readonly companyRepo: Repository<CompanyEntity>,
  ) {}

  async findProductWithCompanies(
    productId: number,
  ): Promise<ProductEntity | null> {
    return this.productRepo.findOne({
      where: { id: productId },
      relations: ['companies'],
    });
  }

  async findCompanyWithProducts(
    companyId: number,
  ): Promise<CompanyEntity | null> {
    return this.companyRepo.findOne({
      where: { id: companyId },
      relations: ['products'],
    });
  }

  async associate(
    product: ProductEntity,
    company: CompanyEntity,
  ): Promise<void> {
    product.companies.push(company);
    await this.productRepo.save(product);
  }

  async disassociate(product: ProductEntity, companyId: number): Promise<void> {
    product.companies = product.companies.filter((c) => c.id !== companyId);
    await this.productRepo.save(product);
  }
}
