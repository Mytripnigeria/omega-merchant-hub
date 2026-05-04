import { apiRequest } from '@/lib/api-client';

export interface Webhook {
  id: string;
  businessId: string;
  url: string;
  events: string[];
  secretLastFour: string;
  isActive: boolean;
  lastTriggeredAt: string | null;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookWithSecret extends Webhook {
  secret: string;
}

export interface CreateWebhookPayload {
  url: string;
  events: string[];
  isActive?: boolean;
}

export const ALLOWED_WEBHOOK_EVENTS = [
  'order.created',
  'order.updated',
  'order.completed',
  'order.cancelled',
  'payment.received',
  'payment.failed',
  'product.low_stock',
  'staff.shift_started',
  'staff.shift_ended',
] as const;

export const webhooksApi = {
  list() {
    return apiRequest<Webhook[]>('/webhooks');
  },
  create(data: CreateWebhookPayload) {
    return apiRequest<WebhookWithSecret>('/webhooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<CreateWebhookPayload>) {
    return apiRequest<Webhook>(`/webhooks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/webhooks/${id}`, { method: 'DELETE' });
  },
  rotateSecret(id: string) {
    return apiRequest<{ secret: string; secretLastFour: string }>(
      `/webhooks/${id}/rotate-secret`,
      { method: 'POST' },
    );
  },
  test(id: string) {
    return apiRequest<{ ok: boolean; status?: number; error?: string }>(
      `/webhooks/${id}/test`,
      { method: 'POST' },
    );
  },
};
