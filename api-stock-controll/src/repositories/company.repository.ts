import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CompanyEntity } from '../entities/company.entity';
import { CreateCompanyDto } from '../dtos/company/create-company.dto';
import { UpdateCompanyDto } from '../dtos/company/update-company.dto';

@Injectable()
export class CompanyRepository {
  constructor(
    @Inject('COMPANY_REPOSITORY')
    private readonly repo: Repository<CompanyEntity>,
  ) {}

  async create(dto: CreateCompanyDto): Promise<CompanyEntity> {
    const company = this.repo.create(dto);
    return this.repo.save(company);
  }

  async update(id: number, dto: UpdateCompanyDto): Promise<CompanyEntity> {
    await this.repo.update(id, dto);
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findAll(): Promise<CompanyEntity[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<CompanyEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async findByCnpj(cnpj: string): Promise<CompanyEntity | null> {
    return this.repo.findOneBy({ cnpj });
  }
}
