/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

const CATEGORIES = ['Eletrônicos', 'Alimentos', 'Vestuário', 'Outro'] as const;

export class CreateProductDto {
  @IsNotEmpty({ message: 'Nome do produto é obrigatório' })
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString()
  description!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Quantidade deve ser um número inteiro' })
  @Min(0, { message: 'Quantidade não pode ser negativa' })
  stock_quantity?: number;

  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  @IsIn(CATEGORIES, {
    message: 'Categoria deve ser: Eletrônicos, Alimentos, Vestuário ou Outro',
  })
  category!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de validade inválida' })
  expiration_date?: string;
}
