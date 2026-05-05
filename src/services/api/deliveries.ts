import { apiRequest } from "@/lib/api-client";

export type DeliveryStatus =
  | "pending"
  | "assigned"
  | "in_transit"
  | "delivered"
  | "failed";

export interface Delivery {
  id: string;
  orderId: string;
  businessId: string;
  storeId: string;
  riderStaffId: string | null;
  riderName: string | null;
  address: string;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  status: DeliveryStatus;
  assignedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  failureReason: string | null;
  notes: string | null;
  orderNumber: number | null;
  customerName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedDeliveries {
  data: Delivery[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DeliveryFilters {
  storeId?: string;
  riderStaffId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: DeliveryFilters): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const deliveriesService = {
  list: (filters: DeliveryFilters = {}): Promise<PaginatedDeliveries> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedDeliveries>(`/deliveries${qs ? `?${qs}` : ""}`);
  },

  findOne: (id: string): Promise<Delivery> => apiRequest<Delivery>(`/deliveries/${id}`),

  create: (input: { orderId: string; address: string; phone?: string; notes?: string }): Promise<Delivery> =>
    apiRequest<Delivery>("/deliveries", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  assign: (id: string, riderStaffId: string): Promise<Delivery> =>
    apiRequest<Delivery>(`/deliveries/${id}/assign`, {
      method: "POST",
      body: JSON.stringify({ riderStaffId }),
    }),

  fail: (id: string, reason: string): Promise<Delivery> =>
    apiRequest<Delivery>(`/deliveries/${id}/fail`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};
