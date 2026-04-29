import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CompanyRepository } from '../repositories/company.repository';
import { CreateCompanyDto } from '../dtos/company/create-company.dto';
import { UpdateCompanyDto } from '../dtos/company/update-company.dto';
import { CompanyEntity } from '../entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async create(dto: CreateCompanyDto): Promise<CompanyEntity> {
    const existing = await this.companyRepository.findByCnpj(dto.cnpj);
    if (existing) {
      throw new ConflictException(
        'Fornecedor com esse CNPJ já está cadastrado!',
      );
    }
    return this.companyRepository.create(dto);
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<CompanyEntity> {
    await this.findById(id);

    if (dto.cnpj) {
      const existing = await this.companyRepository.findByCnpj(dto.cnpj);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Fornecedor com esse CNPJ já está cadastrado!',
        );
      }
    }

    return this.companyRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.companyRepository.delete(id);
  }

  async findAll(): Promise<CompanyEntity[]> {
    return this.companyRepository.findAll();
  }

  async findById(id: number): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException(`Fornecedor com id ${id} não encontrado`);
    }
    return company;
  }
}
