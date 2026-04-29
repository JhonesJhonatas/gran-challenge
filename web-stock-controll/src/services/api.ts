import axios from 'axios';

export const api = axios.create({ baseURL: 'http://localhost:3333/api/v1' });

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (typeof data?.message === 'string') return data.message;
    if (Array.isArray(data?.message)) return data.message[0] as string;
  }
  return 'Ocorreu um erro inesperado.';
}
