import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AssociationRepository } from '../repositories/association.repository';
import { CompanyEntity } from '../entities/company.entity';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class AssociationService {
  constructor(private readonly associationRepository: AssociationRepository) {}

  async associate(productId: number, companyId: number): Promise<void> {
    const product = await this.getProduct(productId);
    const company = await this.getCompany(companyId);

    const alreadyLinked = product.companies.some((c) => c.id === companyId);
    if (alreadyLinked) {
      throw new ConflictException(
        'Fornecedor já está associado a este produto!',
      );
    }

    await this.associationRepository.associate(product, company);
  }

  async disassociate(productId: number, companyId: number): Promise<void> {
    const product = await this.getProduct(productId);

    const linked = product.companies.some((c) => c.id === companyId);
    if (!linked) {
      throw new NotFoundException('Associação não encontrada');
    }

    await this.associationRepository.disassociate(product, companyId);
  }

  async getCompaniesByProduct(productId: number): Promise<CompanyEntity[]> {
    const product = await this.getProduct(productId);
    return product.companies;
  }

  async getProductsByCompany(companyId: number): Promise<ProductEntity[]> {
    const company = await this.getCompany(companyId);
    return company.products;
  }

  private async getProduct(productId: number): Promise<ProductEntity> {
    const product =
      await this.associationRepository.findProductWithCompanies(productId);
    if (!product) {
      throw new NotFoundException(`Produto com id ${productId} não encontrado`);
    }
    return product;
  }

  private async getCompany(companyId: number): Promise<CompanyEntity> {
    const company =
      await this.associationRepository.findCompanyWithProducts(companyId);
    if (!company) {
      throw new NotFoundException(
        `Fornecedor com id ${companyId} não encontrado`,
      );
    }
    return company;
  }
}
