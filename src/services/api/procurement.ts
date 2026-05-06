import { apiRequest } from "@/lib/api-client";

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

// ─── Inventory Locations ────────────────────────────────────────────────────

export type InventoryLocationType =
  | "instore"
  | "outstore"
  | "warehouse"
  | "kitchen"
  | "bar";

export interface InventoryLocation {
  id: string;
  storeId: string;
  name: string;
  type: InventoryLocationType;
  address: string | null;
  description: string | null;
  isDefault: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryLocationRequest {
  storeId: string;
  name: string;
  type: InventoryLocationType;
  address?: string;
  description?: string;
  isDefault?: boolean;
}

export const inventoryLocationsApi = {
  list(params?: { storeId?: string; type?: InventoryLocationType; search?: string; page?: number; limit?: number }) {
    return apiRequest<PaginatedResponse<InventoryLocation>>(`/inventory-locations${buildQs(params)}`);
  },
  get(id: string) {
    return apiRequest<InventoryLocation>(`/inventory-locations/${id}`);
  },
  create(data: CreateInventoryLocationRequest) {
    return apiRequest<InventoryLocation>(`/inventory-locations`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<Omit<CreateInventoryLocationRequest, "storeId">>) {
    return apiRequest<InventoryLocation>(`/inventory-locations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/inventory-locations/${id}`, { method: "DELETE" });
  },
};

// ─── Stock Transfers ────────────────────────────────────────────────────────

export type StockTransferStatus =
  | "pending"
  | "in-transit"
  | "received"
  | "cancelled";

export interface StockTransferItem {
  id: string;
  ingredientId: string;
  name: string;
  unit: string;
  quantity: number;
  receivedQuantity: number | null;
  unitCost: number;
  totalCost: number;
}

export interface StockTransfer {
  id: string;
  storeId: string;
  fromLocationId: string;
  toLocationId: string;
  status: StockTransferStatus;
  requestedById: string | null;
  requestedByName: string | null;
  approvedById: string | null;
  approvedAt: string | null;
  receivedById: string | null;
  receivedAt: string | null;
  notes: string | null;
  items: StockTransferItem[];
  totalItems: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockTransferRequest {
  storeId: string;
  fromLocationId: string;
  toLocationId: string;
  notes?: string;
  items: { ingredientId: string; quantity: number }[];
}

export const stockTransfersApi = {
  list(params?: {
    storeId?: string;
    status?: StockTransferStatus;
    fromLocationId?: string;
    toLocationId?: string;
    page?: number;
    limit?: number;
  }) {
    return apiRequest<PaginatedResponse<StockTransfer>>(`/stock-transfers${buildQs(params)}`);
  },
  get(id: string) {
    return apiRequest<StockTransfer>(`/stock-transfers/${id}`);
  },
  create(data: CreateStockTransferRequest) {
    return apiRequest<StockTransfer>(`/stock-transfers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<Omit<CreateStockTransferRequest, "storeId">>) {
    return apiRequest<StockTransfer>(`/stock-transfers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  approve(id: string) {
    return apiRequest<StockTransfer>(`/stock-transfers/${id}/approve`, { method: "POST" });
  },
  receive(id: string, items: { itemId: string; receivedQuantity: number }[]) {
    return apiRequest<StockTransfer>(`/stock-transfers/${id}/receive`, {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },
  cancel(id: string) {
    return apiRequest<StockTransfer>(`/stock-transfers/${id}/cancel`, { method: "POST" });
  },
  remove(id: string) {
    return apiRequest<void>(`/stock-transfers/${id}`, { method: "DELETE" });
  },
};

// ─── Equipment ──────────────────────────────────────────────────────────────

export type EquipmentCategory =
  | "kitchen"
  | "refrigeration"
  | "pos"
  | "furniture"
  | "hvac"
  | "other";

export type EquipmentStatus =
  | "operational"
  | "maintenance"
  | "repair"
  | "offline"
  | "retired";

export interface Equipment {
  id: string;
  storeId: string;
  locationId: string | null;
  name: string;
  category: EquipmentCategory;
  description: string | null;
  serialNumber: string | null;
  model: string | null;
  manufacturer: string | null;
  purchaseDate: string | null;
  purchasePrice: number | null;
  warrantyExpiry: string | null;
  status: EquipmentStatus;
  currentTemperature: number | null;
  targetTemperature: number | null;
  lastMaintenanceDate: string | null;
  nextMaintenanceDate: string | null;
  maintenanceCycleDays: number | null;
  uptime: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentRequest {
  storeId: string;
  locationId?: string;
  name: string;
  category: EquipmentCategory;
  description?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
  status?: EquipmentStatus;
  currentTemperature?: number;
  targetTemperature?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceCycleDays?: number;
  notes?: string;
}

export type MaintenanceType = "routine" | "repair" | "inspection" | "cleaning";

export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  type: MaintenanceType;
  performedOn: string;
  performedBy: string | null;
  cost: number | null;
  description: string;
  createdAt: string;
}

export const equipmentApi = {
  list(params?: {
    storeId?: string;
    locationId?: string;
    category?: EquipmentCategory;
    status?: EquipmentStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return apiRequest<PaginatedResponse<Equipment>>(`/equipment${buildQs(params)}`);
  },
  get(id: string) {
    return apiRequest<Equipment>(`/equipment/${id}`);
  },
  create(data: CreateEquipmentRequest) {
    return apiRequest<Equipment>(`/equipment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<Omit<CreateEquipmentRequest, "storeId">>) {
    return apiRequest<Equipment>(`/equipment/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/equipment/${id}`, { method: "DELETE" });
  },
  maintenanceLogs(id: string) {
    return apiRequest<MaintenanceLog[]>(`/equipment/${id}/maintenance`);
  },
  logMaintenance(
    id: string,
    payload: {
      type: MaintenanceType;
      performedOn: string;
      performedBy?: string;
      cost?: number;
      description: string;
    },
  ) {
    return apiRequest<MaintenanceLog>(`/equipment/${id}/maintenance`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
