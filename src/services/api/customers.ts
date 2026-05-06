import { apiRequest } from "@/lib/api-client";
import type {
  Customer,
  CustomerFilters,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerStats,
  WalletTransaction,
  PointsTransaction,
} from "@/types/customers";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(filters?: Record<string, unknown>): string {
  if (!filters) return "";
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const customersApi = {
  list(filters?: CustomerFilters & { page?: number; limit?: number }) {
    return apiRequest<PaginatedResponse<Customer>>(`/customers${buildQuery(filters)}`);
  },

  get(id: string) {
    return apiRequest<Customer>(`/customers/${id}`);
  },

  stats() {
    return apiRequest<CustomerStats>(`/customers/stats`);
  },

  create(data: CreateCustomerRequest) {
    return apiRequest<Customer>(`/customers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateCustomerRequest) {
    return apiRequest<Customer>(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return apiRequest<void>(`/customers/${id}`, { method: "DELETE" });
  },

  walletTxs(id: string) {
    return apiRequest<WalletTransaction[]>(`/customers/${id}/wallet-transactions`);
  },

  creditWallet(id: string, payload: { amount: number; description: string; reference?: string }) {
    return apiRequest<WalletTransaction>(`/customers/${id}/wallet/credit`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  debitWallet(id: string, payload: { amount: number; description: string; reference?: string }) {
    return apiRequest<WalletTransaction>(`/customers/${id}/wallet/debit`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  pointsTxs(id: string) {
    return apiRequest<PointsTransaction[]>(`/customers/${id}/points-transactions`);
  },

  addPoints(id: string, payload: { points: number; description: string; orderId?: string }) {
    return apiRequest<PointsTransaction>(`/customers/${id}/points/add`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  redeemPoints(id: string, payload: { points: number; description: string }) {
    return apiRequest<PointsTransaction>(`/customers/${id}/points/redeem`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
