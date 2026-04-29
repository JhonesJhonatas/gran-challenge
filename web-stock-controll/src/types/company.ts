export interface Company {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  phone_number: string;
  email: string;
  main_contact: 'email' | 'phone_number';
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyPayload {
  name: string;
  cnpj: string;
  address: string;
  phone_number: string;
  email: string;
  main_contact: 'email' | 'phone_number';
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>;
