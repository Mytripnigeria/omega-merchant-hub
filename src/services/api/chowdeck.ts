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
  /**
   * Items that were on the Chowdeck menu before this publish and are not in our
   * catalogue. Chowdeck's bulk upload REPLACES the menu, so these were removed.
   */
  replacedItems?: string[];
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

/** One of possibly several Chowdeck vendor listings on a store. */
export interface ChowdeckChannel extends ChowdeckConfig {
  label: string | null;
}

export const chowdeckService = {
  /**
   * Every channel on the store. A store can sell through more than one
   * Chowdeck vendor listing, each with its own credentials and menu.
   */
  channels(storeId: string): Promise<ChowdeckChannel[]> {
    return apiRequest<ChowdeckChannel[]>(
      `/integrations/chowdeck/${storeId}/channels`,
    );
  },
  addChannel(storeId: string, payload: ChowdeckUpsert & { label?: string }) {
    return apiRequest<ChowdeckChannel>(
      `/integrations/chowdeck/${storeId}/channels`,
      { method: 'POST', body: JSON.stringify(payload) },
    );
  },
  updateChannel(
    storeId: string,
    channelId: string,
    payload: ChowdeckUpsert & { label?: string },
  ) {
    return apiRequest<ChowdeckChannel>(
      `/integrations/chowdeck/${storeId}/channels/${channelId}`,
      { method: 'PUT', body: JSON.stringify(payload) },
    );
  },
  syncChannelMenu(storeId: string, channelId: string): Promise<ChowdeckSyncResult> {
    return apiRequest(
      `/integrations/chowdeck/${storeId}/channels/${channelId}/sync-menu`,
      { method: 'POST' },
    );
  },
  testChannel(storeId: string, channelId: string) {
    return apiRequest<{ ok: boolean; menuItems: number }>(
      `/integrations/chowdeck/${storeId}/channels/${channelId}/test`,
      { method: 'POST' },
    );
  },
  testOrder(storeId: string, channelId: string) {
    return apiRequest<{ orderNumber: number }>(
      `/integrations/chowdeck/${storeId}/channels/${channelId}/test-order`,
      { method: 'POST' },
    );
  },
  removeChannel(storeId: string, channelId: string): Promise<void> {
    return apiRequest(
      `/integrations/chowdeck/${storeId}/channels/${channelId}`,
      { method: 'DELETE' },
    );
  },
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
