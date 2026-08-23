import { apiRequest } from '@/lib/api-client';

export interface CloveChannel {
  id: string;
  storeId: string;
  label: string | null;
  cloveStoreId: string | null;
  baseUrl: string;
  isEnabled: boolean;
  autoAccept: boolean;
  /** Masked — the real key is never returned. */
  apiKeyPreview: string | null;
  lastMenuSyncAt: string | null;
  lastOrderSyncAt: string | null;
}

export interface CloveUpsert {
  label?: string;
  /** Omit to keep the stored key. */
  apiKey?: string;
  cloveStoreId?: string;
  baseUrl?: string;
  isEnabled?: boolean;
  autoAccept?: boolean;
}

export interface CloveSyncResult {
  published: number;
  created: number;
  updated: number;
  failures: string[];
  mapped: number;
}

export interface ClovePullResult {
  pulled: number;
  ingested: number;
  duplicates: number;
  skipped: number;
  failed: number;
}

const base = (storeId: string) => `/integrations/clove/${storeId}/channels`;

export const cloveService = {
  channels(storeId: string): Promise<CloveChannel[]> {
    return apiRequest<CloveChannel[]>(base(storeId));
  },
  add(storeId: string, payload: CloveUpsert): Promise<CloveChannel> {
    return apiRequest<CloveChannel>(base(storeId), {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  update(
    storeId: string,
    channelId: string,
    payload: CloveUpsert,
  ): Promise<CloveChannel> {
    return apiRequest<CloveChannel>(`${base(storeId)}/${channelId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  test(storeId: string, channelId: string): Promise<{ ok: boolean; products: number }> {
    return apiRequest(`${base(storeId)}/${channelId}/test`, { method: 'POST' });
  },
  syncMenu(storeId: string, channelId: string): Promise<CloveSyncResult> {
    return apiRequest(`${base(storeId)}/${channelId}/sync-menu`, { method: 'POST' });
  },
  pullOrders(storeId: string, channelId: string): Promise<ClovePullResult> {
    return apiRequest(`${base(storeId)}/${channelId}/pull-orders`, { method: 'POST' });
  },
  testOrder(storeId: string, channelId: string): Promise<{ orderNumber: number }> {
    return apiRequest(`${base(storeId)}/${channelId}/test-order`, { method: 'POST' });
  },
  disconnect(storeId: string, channelId: string): Promise<void> {
    return apiRequest(`${base(storeId)}/${channelId}`, { method: 'DELETE' });
  },
};
