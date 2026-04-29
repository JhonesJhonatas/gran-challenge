import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from '../dtos/company/create-company.dto';
import { UpdateCompanyDto } from '../dtos/company/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCompanyDto) {
    const company = await this.companyService.create(dto);
    return { message: 'Fornecedor cadastrado com sucesso!', data: company };
  }

  @Get()
  async findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
  ) {
    const company = await this.companyService.update(id, dto);
    return { message: 'Fornecedor atualizado com sucesso!', data: company };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.delete(id);
  }
}
