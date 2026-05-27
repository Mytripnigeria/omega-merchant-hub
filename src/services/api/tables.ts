import { apiRequest } from "@/lib/api-client";

export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";

export interface RestaurantTable {
  id: string;
  businessId: string;
  storeId: string;
  name: string;
  section: string | null;
  capacity: number;
  status: TableStatus;
  positionX: number | null;
  positionY: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableRequest {
  storeId: string;
  name: string;
  section?: string;
  capacity?: number;
  status?: TableStatus;
  positionX?: number;
  positionY?: number;
  notes?: string;
}

export type UpdateTableRequest = Partial<Omit<CreateTableRequest, "storeId">>;

export interface TableFilter {
  storeId?: string;
  status?: TableStatus;
  section?: string;
}

function buildQs(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export const tablesApi = {
  list: (filter: TableFilter = {}) =>
    apiRequest<RestaurantTable[]>(
      `/tables${buildQs(filter as Record<string, unknown>)}`,
    ),

  create: (data: CreateTableRequest) =>
    apiRequest<RestaurantTable>(`/tables`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateTableRequest) =>
    apiRequest<RestaurantTable>(`/tables/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: TableStatus) =>
    apiRequest<RestaurantTable>(`/tables/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  remove: (id: string) => apiRequest<void>(`/tables/${id}`, { method: "DELETE" }),
};
