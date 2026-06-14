import { apiRequest } from '@/lib/api-client';

export type PaymentMethodType = 'cash' | 'card' | 'transfer' | 'pos' | 'mobile_money' | 'wallet' | 'other';

/** Channels a payment method can show on (matches product/category visibility). */
export type PaymentMethodChannel = 'pos' | 'self' | 'storefront' | 'omni';

export interface PaymentMethod {
  id: string;
  businessId: string;
  type: PaymentMethodType;
  label: string;
  isEnabled: boolean;
  visibility: string[];
  config: Record<string, unknown> | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodPayload {
  type: PaymentMethodType;
  label: string;
  isEnabled?: boolean;
  visibility?: string[];
  config?: Record<string, unknown>;
  order?: number;
}

export const paymentMethodsApi = {
  list() {
    return apiRequest<PaymentMethod[]>('/payment-methods');
  },
  create(data: CreatePaymentMethodPayload) {
    return apiRequest<PaymentMethod>('/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<CreatePaymentMethodPayload>) {
    return apiRequest<PaymentMethod>(`/payment-methods/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/payment-methods/${id}`, { method: 'DELETE' });
  },
  reorder(items: { id: string; order: number }[]) {
    return apiRequest<void>('/payment-methods/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ items }),
    });
  },
};
