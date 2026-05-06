import { apiRequest } from "@/lib/api-client";

export type SupplierStatus = "active" | "inactive" | "suspended";

export interface Supplier {
  id: string;
  businessId: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  paymentTerms: string | null;
  category: string | null;
  status: SupplierStatus;
  rating: number | null;
  notes: string | null;
  totalIngredients: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  paymentTerms?: string;
  category?: string;
  status?: SupplierStatus;
  rating?: number;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQs(params?: Record<string, unknown>): string {
  if (!params) return "";
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const suppliersApi = {
  list(filters?: {
    search?: string;
    status?: SupplierStatus;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    return apiRequest<PaginatedResponse<Supplier>>(`/suppliers${buildQs(filters)}`);
  },
  get(id: string) {
    return apiRequest<Supplier>(`/suppliers/${id}`);
  },
  stats() {
    return apiRequest<{ total: number; active: number }>(`/suppliers/stats`);
  },
  create(data: CreateSupplierRequest) {
    return apiRequest<Supplier>(`/suppliers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<CreateSupplierRequest>) {
    return apiRequest<Supplier>(`/suppliers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/suppliers/${id}`, { method: "DELETE" });
  },
  ingredients(id: string) {
    return apiRequest<{ id: string; name: string; unit: string; sku: string | null }[]>(
      `/suppliers/${id}/ingredients`,
    );
  },
};
