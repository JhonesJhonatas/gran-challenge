import { ProductEntity } from '../../entities/product.entity';

export interface CreateProductProps {
  name: string;
  code: number;
  description: string;
  stock_quantity: number;
  category: string;
  expiration_date: Date;
  image: string;
}

export type CreateProductResponse = ProductEntity;

export interface UpdateProductProps {
  id: number;
  name?: string;
  code?: number;
  description?: string;
  stock_quantity?: number;
  category?: string;
  expiration_date?: Date;
  image?: string;
}

export type UpdateProductResponse = ProductEntity;

export interface DeleteProductProps {
  id: number;
}

export type DeleteProductResponse = void;

export type FindAllProductsResponse = {
  products: ProductEntity[];
};
