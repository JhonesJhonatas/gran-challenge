import { api } from './api';
import type { Product, CreateProductPayload, UpdateProductPayload } from '../types/product';

export const IMAGE_BASE_URL = 'http://localhost:3333/uploads/products';

function toFormData(data: CreateProductPayload | UpdateProductPayload, imageFile?: File): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== '') {
      fd.append(key, String(value));
    }
  }
  if (imageFile) fd.append('image', imageFile);
  return fd;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const res = await api.get<Product[]>('/product');
    return res.data;
  },

  async getById(id: number): Promise<Product> {
    const res = await api.get<Product>(`/product/${id}`);
    return res.data;
  },

  async create(data: CreateProductPayload, imageFile?: File): Promise<Product> {
    const res = await api.post<{ message: string; data: Product }>('/product', toFormData(data, imageFile));
    return res.data.data;
  },

  async update(id: number, data: UpdateProductPayload, imageFile?: File): Promise<Product> {
    const res = await api.put<{ message: string; data: Product }>(`/product/${id}`, toFormData(data, imageFile));
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/product/${id}`);
  },
};
