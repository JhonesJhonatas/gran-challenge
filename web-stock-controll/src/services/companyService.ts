import { api } from './api';
import type { Company, CreateCompanyPayload, UpdateCompanyPayload } from '../types/company';

export const companyService = {
  async getAll(): Promise<Company[]> {
    const res = await api.get<Company[]>('/company');
    return res.data;
  },

  async getById(id: number): Promise<Company> {
    const res = await api.get<Company>(`/company/${id}`);
    return res.data;
  },

  async create(data: CreateCompanyPayload): Promise<Company> {
    const res = await api.post<{ message: string; data: Company }>('/company', data);
    return res.data.data;
  },

  async update(id: number, data: UpdateCompanyPayload): Promise<Company> {
    const res = await api.put<{ message: string; data: Company }>(`/company/${id}`, data);
    return res.data.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/company/${id}`);
  },
};
