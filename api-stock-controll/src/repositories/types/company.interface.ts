import { CompanyEntity } from '../../entities/company.entity';

export interface CreateCompanyProps {
  name: string;
  cnpj: number;
  address: string;
  phone_number: string;
  email: string;
  main_contact: 'email' | 'phone_number';
}

export type CreateCompanyResponse = CompanyEntity;

export interface UpdateCompanyProps {
  id: number;
  name?: string;
  cnpj?: number;
  address?: string;
  phone_number?: string;
  email?: string;
  main_contact?: 'email' | 'phone_number';
}

export type UpdateCompanyResponse = CompanyEntity;

export interface DeleteCompanyProps {
  id: number;
}

export type DeleteCompanyResponse = void;

export interface FindAllCompaniesResponse {
  companies: CompanyEntity[];
}
