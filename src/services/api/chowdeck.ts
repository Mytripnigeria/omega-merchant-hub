import { apiRequest } from '@/lib/api-client';

export interface ChowdeckConfig {
  id: string;
  storeId: string;
  merchantReference: string;
  baseUrl: string;
  isEnabled: boolean;
  autoAccept: boolean;
  /** Masked — the real key is never returned. */
  secretKeyPreview: string | null;
  lastMenuSyncAt: string | null;
  lastWebhookAt: string | null;
  /** What the merchant pastes into Chowdeck's dashboard. */
  webhookUrl: string | null;
}

export interface ChowdeckUpsert {
  merchantReference?: string;
  /** Omit to keep the stored key. */
  secretKey?: string;
  baseUrl?: string;
  isEnabled?: boolean;
  autoAccept?: boolean;
}

export interface ChowdeckSyncResult {
  published: number;
  /** New items added to Chowdeck. */
  created: number;
  /** Existing items corrected in place (price, name, availability). */
  updated: number;
  /** Items Chowdeck refused to update — bulk update reports these per row. */
  updateFailures: string[];
  mapped: number;
  /** Items live on Chowdeck that don't correspond to any of our products. */
  unmapped: string[];
}

export const chowdeckService = {
  get(storeId: string): Promise<ChowdeckConfig | null> {
    return apiRequest<ChowdeckConfig | null>(`/integrations/chowdeck/${storeId}`);
  },
  save(storeId: string, payload: ChowdeckUpsert): Promise<ChowdeckConfig> {
    return apiRequest<ChowdeckConfig>(`/integrations/chowdeck/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  test(storeId: string): Promise<{ ok: boolean; menuItems: number }> {
    return apiRequest(`/integrations/chowdeck/${storeId}/test`, { method: 'POST' });
  },
  syncMenu(storeId: string): Promise<ChowdeckSyncResult> {
    return apiRequest(`/integrations/chowdeck/${storeId}/sync-menu`, {
      method: 'POST',
    });
  },
  disconnect(storeId: string): Promise<void> {
    return apiRequest(`/integrations/chowdeck/${storeId}`, { method: 'DELETE' });
  },
};
