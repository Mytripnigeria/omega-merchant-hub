import { apiRequest } from '@/lib/api-client';

export interface TaxRate {
  id: string;
  businessId: string;
  name: string;
  ratePercent: number;
  isInclusive: boolean;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaxRatePayload {
  name: string;
  ratePercent: number;
  isInclusive?: boolean;
  isDefault?: boolean;
  isActive?: boolean;
}

export const taxRatesApi = {
  list() {
    return apiRequest<TaxRate[]>('/tax-rates');
  },
  create(data: CreateTaxRatePayload) {
    return apiRequest<TaxRate>('/tax-rates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<CreateTaxRatePayload>) {
    return apiRequest<TaxRate>(`/tax-rates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/tax-rates/${id}`, { method: 'DELETE' });
  },
};
