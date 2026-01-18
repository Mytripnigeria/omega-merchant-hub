// Procurement Types

export interface InventoryLocation {
  id: string;
  storeId: string;
  name: string;
  type: "instore" | "outstore" | "warehouse" | "kitchen" | "bar";
  address?: string;
  description?: string;
  isDefault: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  storeId: string;
  locationId: string;
  locationName: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  reorderPoint: number;
  unitCost: number;
  totalValue: number;
  supplierId?: string;
  supplierName?: string;
  lastRestocked?: string;
  expiryDate?: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expired" | "discontinued";
  ingredientMappings?: IngredientMapping[];
  createdAt: string;
  updatedAt: string;
}

export interface IngredientMapping {
  ingredientId: string;
  ingredientName: string;
  conversionRate: number; // e.g., 1 inventory unit = X ingredient units
  unit: string;
}

export interface Equipment {
  id: string;
  storeId: string;
  locationId?: string;
  locationName?: string;
  name: string;
  description?: string;
  category: "kitchen" | "refrigeration" | "pos" | "furniture" | "hvac" | "other";
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
  status: "operational" | "maintenance" | "repair" | "offline" | "retired";
  currentTemperature?: number;
  targetTemperature?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceCycle?: number; // in days
  uptime?: number; // percentage
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransfer {
  id: string;
  storeId: string;
  fromLocationId: string;
  fromLocationName: string;
  toLocationId: string;
  toLocationName: string;
  items: StockTransferItem[];
  totalItems: number;
  totalValue: number;
  status: "pending" | "in-transit" | "received" | "cancelled";
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  receivedBy?: string;
  receivedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockTransferItem {
  id: string;
  inventoryId: string;
  inventoryName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  receivedQuantity?: number;
}

// Filters
export interface InventoryLocationFilters {
  storeId?: string;
  type?: InventoryLocation["type"];
  search?: string;
  page?: number;
  limit?: number;
}

export interface InventoryFilters {
  storeId?: string;
  locationId?: string;
  category?: string;
  status?: Inventory["status"];
  supplierId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EquipmentFilters {
  storeId?: string;
  locationId?: string;
  category?: Equipment["category"];
  status?: Equipment["status"];
  search?: string;
  page?: number;
  limit?: number;
}

export interface StockTransferFilters {
  storeId?: string;
  fromLocationId?: string;
  toLocationId?: string;
  status?: StockTransfer["status"];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Request types
export interface CreateInventoryLocationRequest {
  storeId: string;
  name: string;
  type: InventoryLocation["type"];
  address?: string;
  description?: string;
  isDefault?: boolean;
}

export interface UpdateInventoryLocationRequest {
  name?: string;
  type?: InventoryLocation["type"];
  address?: string;
  description?: string;
  isDefault?: boolean;
}

export interface CreateInventoryRequest {
  storeId: string;
  locationId: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  maxQuantity?: number;
  reorderPoint: number;
  unitCost: number;
  supplierId?: string;
  expiryDate?: string;
  ingredientMappings?: Omit<IngredientMapping, 'ingredientName'>[];
}

export interface UpdateInventoryRequest {
  locationId?: string;
  sku?: string;
  name?: string;
  description?: string;
  category?: string;
  unit?: string;
  quantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  reorderPoint?: number;
  unitCost?: number;
  supplierId?: string;
  expiryDate?: string;
  status?: Inventory["status"];
  ingredientMappings?: IngredientMapping[];
}

export interface CreateEquipmentRequest {
  storeId: string;
  locationId?: string;
  name: string;
  description?: string;
  category: Equipment["category"];
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
  targetTemperature?: number;
  maintenanceCycle?: number;
  notes?: string;
}

export interface UpdateEquipmentRequest {
  locationId?: string;
  name?: string;
  description?: string;
  category?: Equipment["category"];
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
  status?: Equipment["status"];
  currentTemperature?: number;
  targetTemperature?: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceCycle?: number;
  notes?: string;
}

export interface CreateStockTransferRequest {
  storeId: string;
  fromLocationId: string;
  toLocationId: string;
  items: Omit<StockTransferItem, 'id' | 'inventoryName' | 'totalCost' | 'receivedQuantity'>[];
  notes?: string;
}

export interface UpdateStockTransferRequest {
  status?: StockTransfer["status"];
  items?: StockTransferItem[];
  receivedBy?: string;
  receivedAt?: string;
  notes?: string;
}

// Stats
export interface ProcurementStats {
  totalLocations: number;
  totalInventoryItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalEquipment: number;
  equipmentInMaintenance: number;
  pendingTransfers: number;
  totalInventoryValue: number;
}
