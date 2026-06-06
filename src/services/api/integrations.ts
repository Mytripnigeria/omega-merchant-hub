import { apiRequest } from '@/lib/api-client';

export type IntegrationProvider = 'paystack' | 'flutterwave';

export interface Integration {
  provider: IntegrationProvider;
  publicKey: string | null;
  /** Masked secret preview, e.g. "sk_live_••••4f2a". Never the raw secret. */
  secretKeyMasked: string | null;
  secretKeySet: boolean;
  isEnabled: boolean;
  isLive: boolean;
  updatedAt: string | null;
}

export interface UpdateIntegrationPayload {
  publicKey?: string;
  /** Omit to keep the existing secret unchanged. */
  secretKey?: string;
  isEnabled?: boolean;
  isLive?: boolean;
}

export const integrationsApi = {
  list() {
    return apiRequest<Integration[]>('/integrations/payment-providers');
  },
  update(provider: IntegrationProvider, data: UpdateIntegrationPayload) {
    return apiRequest<Integration>(
      `/integrations/payment-providers/${provider}`,
      { method: 'PUT', body: JSON.stringify(data) },
    );
  },
};
