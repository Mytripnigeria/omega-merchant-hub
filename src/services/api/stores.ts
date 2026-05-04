import { apiRequest } from '@/lib/api-client';
import type { Store, WeeklyHours } from '@/types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateStorePayload {
  name: string;
  address: string;
  phone: string;
  email: string;
  city?: string;
  state?: string;
  logoUrl?: string;
  description?: string;
  timezone?: string;
  openingHours?: WeeklyHours;
  deliveryRadiusKm?: number;
}

export interface UpdateStorePayload extends Partial<CreateStorePayload> {
  isActive?: boolean;
}

export const storesApi = {
  list(params?: { page?: number; limit?: number }) {
    const qs = params
      ? '?' +
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => `${k}=${v}`)
          .join('&')
      : '';
    return apiRequest<PaginatedResponse<Store>>(`/stores${qs}`);
  },
  get(id: string) {
    return apiRequest<Store>(`/stores/${id}`);
  },
  create(data: CreateStorePayload) {
    return apiRequest<Store>('/stores', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: UpdateStorePayload) {
    return apiRequest<Store>(`/stores/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/stores/${id}`, { method: 'DELETE' });
  },
};
