import { apiRequest } from "@/lib/api-client";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export type OrderChannel = "pos" | "website" | "phone";
export type PrepStatus = "pending" | "preparing" | "ready";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  comboId: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  variation: Record<string, unknown> | null;
  addons: Record<string, unknown>[] | null;
  notes: string | null;
  prepStatus: PrepStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  businessId: string;
  storeId: string;
  staffId: string | null;
  staffName: string | null;
  customerName: string | null;
  customerPhone: string | null;
  tableNumber: string | null;
  channel: OrderChannel;
  isDelivery: boolean;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  paidAmount: number;
  paymentMethodId: string | null;
  paidAt: string | null;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderStats {
  todayCount: number;
  todayRevenue: number;
  pendingCount: number;
  preparingCount: number;
  readyCount: number;
}

export interface OrderFilters {
  storeId?: string;
  staffId?: string;
  status?: string;
  channel?: OrderChannel;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: OrderFilters): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export const ordersService = {
  list: (filters: OrderFilters = {}): Promise<PaginatedOrders> => {
    const qs = buildQuery(filters);
    return apiRequest<PaginatedOrders>(`/orders${qs ? `?${qs}` : ""}`);
  },

  findOne: (id: string): Promise<Order> => apiRequest<Order>(`/orders/${id}`),

  stats: (storeId?: string): Promise<OrderStats> =>
    apiRequest<OrderStats>(
      `/orders/stats${storeId ? `?storeId=${encodeURIComponent(storeId)}` : ""}`,
    ),

  cancel: (id: string, reason?: string): Promise<Order> =>
    apiRequest<Order>(`/orders/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};
