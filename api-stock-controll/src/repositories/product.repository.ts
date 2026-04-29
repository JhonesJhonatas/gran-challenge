import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProductEntity } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/product/create-product.dto';
import { UpdateProductDto } from '../dtos/product/update-product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async create(dto: CreateProductDto, image?: string): Promise<ProductEntity> {
    const product = this.repo.create({
      ...dto,
      image,
      expiration_date: dto.expiration_date
        ? new Date(dto.expiration_date)
        : undefined,
    });
    return this.repo.save(product);
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    image?: string,
  ): Promise<ProductEntity> {
    const payload: Partial<ProductEntity> = {
      ...dto,
      expiration_date: dto.expiration_date
        ? new Date(dto.expiration_date)
        : undefined,
    };
    if (image) payload.image = image;
    await this.repo.update(id, payload);
    return this.repo.findOneByOrFail({ id });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.repo.find({ relations: ['companies'] });
  }

  async findById(id: number): Promise<ProductEntity | null> {
    return this.repo.findOne({ where: { id }, relations: ['companies'] });
  }

  async findByBarcode(barcode: string): Promise<ProductEntity | null> {
    return this.repo.findOneBy({ barcode });
  }
}
