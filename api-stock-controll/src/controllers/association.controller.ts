import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { AssociationService } from '../services/association.service';

@Controller()
export class AssociationController {
  constructor(private readonly associationService: AssociationService) {}

  @Post('product/:productId/company/:companyId')
  @HttpCode(HttpStatus.OK)
  async associate(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    await this.associationService.associate(productId, companyId);
    return { message: 'Fornecedor associado com sucesso ao produto!' };
  }

  @Delete('product/:productId/company/:companyId')
  @HttpCode(HttpStatus.OK)
  async disassociate(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    await this.associationService.disassociate(productId, companyId);
    return { message: 'Fornecedor desassociado com sucesso!' };
  }

  @Get('product/:productId/companies')
  async getCompaniesByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.associationService.getCompaniesByProduct(productId);
  }

  @Get('company/:companyId/products')
  async getProductsByCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    return this.associationService.getProductsByCompany(companyId);
  }
}
