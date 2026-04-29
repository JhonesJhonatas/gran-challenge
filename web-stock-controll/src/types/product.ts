export type ProductCategory = 'Eletrônicos' | 'Alimentos' | 'Vestuário' | 'Outro';

export interface Product {
  id: number;
  name: string;
  barcode?: string;
  description: string;
  stock_quantity: number;
  category: ProductCategory;
  expiration_date?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  name: string;
  barcode?: string;
  description: string;
  stock_quantity?: number;
  category: ProductCategory;
  expiration_date?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
