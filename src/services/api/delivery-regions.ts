import { apiRequest } from '@/lib/api-client';
import type {
  CreateDeliveryRegionRequest,
  DeliveryRegion,
  DeliveryRegionFilters,
  UpdateDeliveryRegionRequest,
} from '@/types/delivery-regions';

function buildQuery(filters: DeliveryRegionFilters = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  }
  return qs.toString();
}

export const deliveryRegionsApi = {
  list(filters: DeliveryRegionFilters = {}) {
    const qs = buildQuery(filters);
    return apiRequest<DeliveryRegion[]>(`/delivery-regions${qs ? `?${qs}` : ''}`);
  },
  get(id: string) {
    return apiRequest<DeliveryRegion>(`/delivery-regions/${id}`);
  },
  create(data: CreateDeliveryRegionRequest) {
    return apiRequest<DeliveryRegion>('/delivery-regions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: UpdateDeliveryRegionRequest) {
    return apiRequest<DeliveryRegion>(`/delivery-regions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/delivery-regions/${id}`, { method: 'DELETE' });
  },
};
