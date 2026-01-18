// Procurement Mock Service
import type {
  InventoryLocation,
  Inventory,
  Equipment,
  StockTransfer,
  InventoryLocationFilters,
  InventoryFilters,
  EquipmentFilters,
  StockTransferFilters,
  CreateInventoryLocationRequest,
  UpdateInventoryLocationRequest,
  CreateInventoryRequest,
  UpdateInventoryRequest,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  CreateStockTransferRequest,
  UpdateStockTransferRequest,
  ProcurementStats,
} from "@/types/procurement";

// Mock data
const mockLocations: InventoryLocation[] = [
  {
    id: "loc-001",
    storeId: "store-1",
    name: "Main Kitchen",
    type: "kitchen",
    description: "Primary food preparation area",
    isDefault: true,
    itemCount: 45,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "loc-002",
    storeId: "store-1",
    name: "Cold Storage",
    type: "warehouse",
    description: "Refrigerated storage room",
    isDefault: false,
    itemCount: 28,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "loc-003",
    storeId: "store-1",
    name: "Bar Area",
    type: "bar",
    description: "Drinks and bar supplies",
    isDefault: false,
    itemCount: 32,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const mockInventory: Inventory[] = [
  {
    id: "inv-001",
    storeId: "store-1",
    locationId: "loc-001",
    locationName: "Main Kitchen",
    sku: "RICE-001",
    name: "Local Rice",
    category: "Grains",
    unit: "kg",
    quantity: 50,
    minQuantity: 20,
    maxQuantity: 100,
    reorderPoint: 25,
    unitCost: 800,
    totalValue: 40000,
    supplierId: "sup-001",
    supplierName: "FoodMart Supplies",
    lastRestocked: "2024-01-15",
    status: "in-stock",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "inv-002",
    storeId: "store-1",
    locationId: "loc-002",
    locationName: "Cold Storage",
    sku: "CHKN-001",
    name: "Frozen Chicken",
    category: "Proteins",
    unit: "kg",
    quantity: 15,
    minQuantity: 20,
    reorderPoint: 25,
    unitCost: 3500,
    totalValue: 52500,
    status: "low-stock",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
  },
  {
    id: "inv-003",
    storeId: "store-1",
    locationId: "loc-001",
    locationName: "Main Kitchen",
    sku: "TOM-001",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    unit: "kg",
    quantity: 0,
    minQuantity: 10,
    reorderPoint: 15,
    unitCost: 500,
    totalValue: 0,
    expiryDate: "2024-01-25",
    status: "out-of-stock",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
];

const mockEquipment: Equipment[] = [
  {
    id: "equip-001",
    storeId: "store-1",
    locationId: "loc-002",
    locationName: "Cold Storage",
    name: "Walk-in Freezer",
    category: "refrigeration",
    serialNumber: "WIF-2023-001",
    model: "Arctic Pro 500",
    manufacturer: "CoolTech",
    purchaseDate: "2023-01-15",
    purchasePrice: 2500000,
    warrantyExpiry: "2026-01-15",
    status: "operational",
    currentTemperature: -18,
    targetTemperature: -20,
    lastMaintenanceDate: "2024-01-01",
    nextMaintenanceDate: "2024-04-01",
    maintenanceCycle: 90,
    uptime: 99.5,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "equip-002",
    storeId: "store-1",
    locationId: "loc-001",
    locationName: "Main Kitchen",
    name: "Industrial Oven",
    category: "kitchen",
    serialNumber: "OVN-2022-005",
    model: "Chef Master 3000",
    manufacturer: "ProKitchen",
    purchaseDate: "2022-06-01",
    purchasePrice: 1800000,
    status: "operational",
    lastMaintenanceDate: "2023-12-15",
    nextMaintenanceDate: "2024-03-15",
    maintenanceCycle: 90,
    uptime: 98.2,
    createdAt: "2022-06-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
];

const mockTransfers: StockTransfer[] = [
  {
    id: "trans-001",
    storeId: "store-1",
    fromLocationId: "loc-002",
    fromLocationName: "Cold Storage",
    toLocationId: "loc-001",
    toLocationName: "Main Kitchen",
    items: [
      {
        id: "ti-001",
        inventoryId: "inv-002",
        inventoryName: "Frozen Chicken",
        sku: "CHKN-001",
        quantity: 10,
        unit: "kg",
        unitCost: 3500,
        totalCost: 35000,
      },
    ],
    totalItems: 1,
    totalValue: 35000,
    status: "pending",
    requestedBy: "staff-003",
    requestedByName: "Yusuf Adeleke",
    requestedAt: "2024-01-20T08:00:00Z",
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: "2024-01-20T08:00:00Z",
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const procurementService = {
  // Locations
  async getLocations(filters?: InventoryLocationFilters): Promise<{ data: InventoryLocation[]; total: number }> {
    await delay(300);
    let result = [...mockLocations];
    if (filters?.storeId) result = result.filter(l => l.storeId === filters.storeId);
    if (filters?.type) result = result.filter(l => l.type === filters.type);
    return { data: result, total: result.length };
  },

  async getLocation(id: string): Promise<InventoryLocation | null> {
    await delay(200);
    return mockLocations.find(l => l.id === id) || null;
  },

  async createLocation(data: CreateInventoryLocationRequest): Promise<InventoryLocation> {
    await delay(400);
    const newLocation: InventoryLocation = {
      ...data,
      id: `loc-${Date.now()}`,
      isDefault: data.isDefault || false,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLocations.push(newLocation);
    return newLocation;
  },

  async updateLocation(id: string, data: UpdateInventoryLocationRequest): Promise<InventoryLocation | null> {
    await delay(300);
    const index = mockLocations.findIndex(l => l.id === id);
    if (index === -1) return null;
    mockLocations[index] = { ...mockLocations[index], ...data, updatedAt: new Date().toISOString() };
    return mockLocations[index];
  },

  async deleteLocation(id: string): Promise<boolean> {
    await delay(300);
    const index = mockLocations.findIndex(l => l.id === id);
    if (index === -1) return false;
    mockLocations.splice(index, 1);
    return true;
  },

  // Inventory
  async getInventory(filters?: InventoryFilters): Promise<{ data: Inventory[]; total: number }> {
    await delay(300);
    let result = [...mockInventory];
    if (filters?.storeId) result = result.filter(i => i.storeId === filters.storeId);
    if (filters?.locationId) result = result.filter(i => i.locationId === filters.locationId);
    if (filters?.status) result = result.filter(i => i.status === filters.status);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(search) || i.sku.toLowerCase().includes(search));
    }
    return { data: result, total: result.length };
  },

  async getInventoryItem(id: string): Promise<Inventory | null> {
    await delay(200);
    return mockInventory.find(i => i.id === id) || null;
  },

  async createInventoryItem(data: CreateInventoryRequest): Promise<Inventory> {
    await delay(400);
    const location = mockLocations.find(l => l.id === data.locationId);
    const ingredientMappings = data.ingredientMappings?.map(m => ({
      ...m,
      ingredientName: m.ingredientId,
    }));
    const newItem: Inventory = {
      ...data,
      id: `inv-${Date.now()}`,
      locationName: location?.name || "Unknown",
      totalValue: data.quantity * data.unitCost,
      status: data.quantity === 0 ? "out-of-stock" : data.quantity <= data.minQuantity ? "low-stock" : "in-stock",
      ingredientMappings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockInventory.push(newItem);
    return newItem;
  },

  async updateInventoryItem(id: string, data: UpdateInventoryRequest): Promise<Inventory | null> {
    await delay(300);
    const index = mockInventory.findIndex(i => i.id === id);
    if (index === -1) return null;
    mockInventory[index] = { ...mockInventory[index], ...data, updatedAt: new Date().toISOString() };
    return mockInventory[index];
  },

  async deleteInventoryItem(id: string): Promise<boolean> {
    await delay(300);
    const index = mockInventory.findIndex(i => i.id === id);
    if (index === -1) return false;
    mockInventory.splice(index, 1);
    return true;
  },

  // Equipment
  async getEquipment(filters?: EquipmentFilters): Promise<{ data: Equipment[]; total: number }> {
    await delay(300);
    let result = [...mockEquipment];
    if (filters?.storeId) result = result.filter(e => e.storeId === filters.storeId);
    if (filters?.locationId) result = result.filter(e => e.locationId === filters.locationId);
    if (filters?.category) result = result.filter(e => e.category === filters.category);
    if (filters?.status) result = result.filter(e => e.status === filters.status);
    return { data: result, total: result.length };
  },

  async getEquipmentItem(id: string): Promise<Equipment | null> {
    await delay(200);
    return mockEquipment.find(e => e.id === id) || null;
  },

  async createEquipment(data: CreateEquipmentRequest): Promise<Equipment> {
    await delay(400);
    const location = data.locationId ? mockLocations.find(l => l.id === data.locationId) : null;
    const newEquipment: Equipment = {
      ...data,
      id: `equip-${Date.now()}`,
      locationName: location?.name,
      status: "operational",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockEquipment.push(newEquipment);
    return newEquipment;
  },

  async updateEquipment(id: string, data: UpdateEquipmentRequest): Promise<Equipment | null> {
    await delay(300);
    const index = mockEquipment.findIndex(e => e.id === id);
    if (index === -1) return null;
    mockEquipment[index] = { ...mockEquipment[index], ...data, updatedAt: new Date().toISOString() };
    return mockEquipment[index];
  },

  async deleteEquipment(id: string): Promise<boolean> {
    await delay(300);
    const index = mockEquipment.findIndex(e => e.id === id);
    if (index === -1) return false;
    mockEquipment.splice(index, 1);
    return true;
  },

  // Stock Transfers
  async getStockTransfers(filters?: StockTransferFilters): Promise<{ data: StockTransfer[]; total: number }> {
    await delay(300);
    let result = [...mockTransfers];
    if (filters?.storeId) result = result.filter(t => t.storeId === filters.storeId);
    if (filters?.status) result = result.filter(t => t.status === filters.status);
    if (filters?.fromLocationId) result = result.filter(t => t.fromLocationId === filters.fromLocationId);
    if (filters?.toLocationId) result = result.filter(t => t.toLocationId === filters.toLocationId);
    return { data: result, total: result.length };
  },

  async getStockTransfer(id: string): Promise<StockTransfer | null> {
    await delay(200);
    return mockTransfers.find(t => t.id === id) || null;
  },

  async createStockTransfer(data: CreateStockTransferRequest): Promise<StockTransfer> {
    await delay(400);
    const fromLoc = mockLocations.find(l => l.id === data.fromLocationId);
    const toLoc = mockLocations.find(l => l.id === data.toLocationId);
    
    const items = data.items.map((item, i) => {
      const inv = mockInventory.find(inv => inv.id === item.inventoryId);
      return {
        ...item,
        id: `ti-${Date.now()}-${i}`,
        inventoryName: inv?.name || "Unknown",
        totalCost: item.quantity * item.unitCost,
      };
    });
    
    const newTransfer: StockTransfer = {
      ...data,
      id: `trans-${Date.now()}`,
      fromLocationName: fromLoc?.name || "Unknown",
      toLocationName: toLoc?.name || "Unknown",
      items,
      totalItems: items.length,
      totalValue: items.reduce((sum, i) => sum + i.totalCost, 0),
      status: "pending",
      requestedBy: "current-user",
      requestedByName: "Current User",
      requestedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTransfers.push(newTransfer);
    return newTransfer;
  },

  async updateStockTransfer(id: string, data: UpdateStockTransferRequest): Promise<StockTransfer | null> {
    await delay(300);
    const index = mockTransfers.findIndex(t => t.id === id);
    if (index === -1) return null;
    mockTransfers[index] = { ...mockTransfers[index], ...data, updatedAt: new Date().toISOString() };
    return mockTransfers[index];
  },

  async deleteStockTransfer(id: string): Promise<boolean> {
    await delay(300);
    const index = mockTransfers.findIndex(t => t.id === id);
    if (index === -1) return false;
    mockTransfers.splice(index, 1);
    return true;
  },

  // Stats
  async getStats(storeId?: string): Promise<ProcurementStats> {
    await delay(200);
    const locations = storeId ? mockLocations.filter(l => l.storeId === storeId) : mockLocations;
    const inventory = storeId ? mockInventory.filter(i => i.storeId === storeId) : mockInventory;
    const equipment = storeId ? mockEquipment.filter(e => e.storeId === storeId) : mockEquipment;
    const transfers = storeId ? mockTransfers.filter(t => t.storeId === storeId) : mockTransfers;
    
    return {
      totalLocations: locations.length,
      totalInventoryItems: inventory.length,
      lowStockItems: inventory.filter(i => i.status === 'low-stock').length,
      outOfStockItems: inventory.filter(i => i.status === 'out-of-stock').length,
      totalEquipment: equipment.length,
      equipmentInMaintenance: equipment.filter(e => e.status === 'maintenance').length,
      pendingTransfers: transfers.filter(t => t.status === 'pending').length,
      totalInventoryValue: inventory.reduce((sum, i) => sum + i.totalValue, 0),
    };
  },
};
