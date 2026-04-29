import { api } from './api';
import type { Company } from '../types/company';
import type { Product } from '../types/product';

export const associationService = {
  async associate(productId: number, companyId: number): Promise<void> {
    await api.post(`/product/${productId}/company/${companyId}`);
  },

  async disassociate(productId: number, companyId: number): Promise<void> {
    await api.delete(`/product/${productId}/company/${companyId}`);
  },

  async getCompaniesByProduct(productId: number): Promise<Company[]> {
    const res = await api.get<Company[]>(`/product/${productId}/companies`);
    return res.data;
  },

  async getProductsByCompany(companyId: number): Promise<Product[]> {
    const res = await api.get<Product[]>(`/company/${companyId}/products`);
    return res.data;
  },
};
