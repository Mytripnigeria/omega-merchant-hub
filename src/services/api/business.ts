import { apiRequest } from '@/lib/api-client';

export interface Business {
  id: string;
  name: string;
  legalName?: string;
  registrationNumber?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  currency: string;
  timezone: string;
  logoFileId?: string | null;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  businessId: string;
  receiptHeader?: string;
  receiptFooter?: string;
  receiptShowLogo: boolean;
  receiptShowItemPrices: boolean;
  receiptShowTaxBreakdown: boolean;
  receiptShowServerName: boolean;
  receiptShowOrderNumber: boolean;
  receiptCustomerCopy: boolean;
  notificationDoNotDisturbStart?: string | null;
  notificationDoNotDisturbEnd?: string | null;
  /** VAT rate fraction (0.075 = 7.5%) used at checkout. */
  taxRate?: number;
  /** Prefix applied to new staff codes (e.g. "MJS" → MJS001). */
  staffCodePrefix?: string;
}

export const businessApi = {
  get() {
    return apiRequest<Business>('/business');
  },
  update(data: Partial<Business> & { logoFileId?: string | null }) {
    return apiRequest<Business>('/business', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  getSettings() {
    return apiRequest<BusinessSettings>('/business/settings');
  },
  updateSettings(data: Partial<BusinessSettings>) {
    return apiRequest<BusinessSettings>('/business/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
