import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dtos/product/create-product.dto';
import { UpdateProductDto } from '../dtos/product/update-product.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(dto: CreateProductDto, image?: string): Promise<ProductEntity> {
    if (dto.barcode) {
      const existing = await this.productRepository.findByBarcode(dto.barcode);
      if (existing) {
        throw new ConflictException(
          'Produto com este código de barras já está cadastrado!',
        );
      }
    }
    return this.productRepository.create(dto, image);
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    image?: string,
  ): Promise<ProductEntity> {
    await this.findById(id);

    if (dto.barcode) {
      const existing = await this.productRepository.findByBarcode(dto.barcode);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Produto com este código de barras já está cadastrado!',
        );
      }
    }

    return this.productRepository.update(id, dto, image);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.productRepository.delete(id);
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.findAll();
  }

  async findById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }
    return product;
  }
}
