// Suppliers Mock Service
import type {
  Supplier,
  PurchaseOrder,
  SupplierFilters,
  PurchaseOrderFilters,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  CreatePurchaseOrderRequest,
  UpdatePurchaseOrderRequest,
  SupplierStats,
} from "@/types/suppliers";

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: "sup-001",
    storeId: "store-1",
    name: "FoodMart Supplies",
    contactName: "Olu Adeyemi",
    email: "olu@foodmart.ng",
    phone: "+234 801 555 1111",
    address: "15 Industrial Avenue",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    category: "food",
    paymentTerms: "net-30",
    rating: 4.5,
    status: "active",
    totalOrders: 45,
    totalSpent: 2500000,
    lastOrderDate: "2024-01-15",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "sup-002",
    storeId: "store-1",
    name: "Beverage World",
    contactName: "Chiamaka Eze",
    email: "chiamaka@beverageworld.ng",
    phone: "+234 802 555 2222",
    address: "42 Trade Fair Complex",
    city: "Lagos",
    state: "Lagos",
    category: "beverages",
    paymentTerms: "net-15",
    rating: 4.0,
    status: "active",
    totalOrders: 28,
    totalSpent: 1200000,
    lastOrderDate: "2024-01-10",
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "sup-003",
    storeId: "store-1",
    name: "CleanPro Nigeria",
    contactName: "Emeka Nwosu",
    email: "emeka@cleanpro.ng",
    phone: "+234 803 555 3333",
    category: "cleaning",
    paymentTerms: "cod",
    status: "active",
    totalOrders: 12,
    totalSpent: 350000,
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-001",
    storeId: "store-1",
    supplierId: "sup-001",
    supplierName: "FoodMart Supplies",
    orderNumber: "PO-2024-001",
    items: [
      { id: "poi-001", inventoryId: "inv-001", name: "Local Rice", sku: "RICE-001", quantity: 50, unit: "kg", unitPrice: 800, total: 40000 },
      { id: "poi-002", name: "Palm Oil", quantity: 20, unit: "L", unitPrice: 1500, total: 30000 },
    ],
    subtotal: 70000,
    tax: 5250,
    shipping: 2000,
    total: 77250,
    status: "received",
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-18",
    actualDelivery: "2024-01-17",
    deliveryLocationId: "loc-001",
    deliveryLocationName: "Main Kitchen",
    paymentStatus: "paid",
    paidAmount: 77250,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z",
  },
  {
    id: "po-002",
    storeId: "store-1",
    supplierId: "sup-002",
    supplierName: "Beverage World",
    orderNumber: "PO-2024-002",
    items: [
      { id: "poi-003", name: "Soft Drinks (Crate)", quantity: 10, unit: "crate", unitPrice: 8500, total: 85000 },
      { id: "poi-004", name: "Bottled Water", quantity: 20, unit: "pack", unitPrice: 2000, total: 40000 },
    ],
    subtotal: 125000,
    tax: 9375,
    shipping: 3000,
    total: 137375,
    status: "confirmed",
    orderDate: "2024-01-20",
    expectedDelivery: "2024-01-23",
    paymentStatus: "unpaid",
    paidAmount: 0,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const supplierService = {
  // Suppliers
  async getSuppliers(filters?: SupplierFilters): Promise<{ data: Supplier[]; total: number }> {
    await delay(300);
    let result = [...mockSuppliers];
    
    if (filters?.storeId) result = result.filter(s => s.storeId === filters.storeId);
    if (filters?.category) result = result.filter(s => s.category === filters.category);
    if (filters?.status) result = result.filter(s => s.status === filters.status);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.contactName?.toLowerCase().includes(search)
      );
    }
    
    return { data: result, total: result.length };
  },

  async getSupplier(id: string): Promise<Supplier | null> {
    await delay(200);
    return mockSuppliers.find(s => s.id === id) || null;
  },

  async createSupplier(data: CreateSupplierRequest): Promise<Supplier> {
    await delay(400);
    const newSupplier: Supplier = {
      ...data,
      id: `sup-${Date.now()}`,
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSuppliers.push(newSupplier);
    return newSupplier;
  },

  async updateSupplier(id: string, data: UpdateSupplierRequest): Promise<Supplier | null> {
    await delay(300);
    const index = mockSuppliers.findIndex(s => s.id === id);
    if (index === -1) return null;
    mockSuppliers[index] = { ...mockSuppliers[index], ...data, updatedAt: new Date().toISOString() };
    return mockSuppliers[index];
  },

  async deleteSupplier(id: string): Promise<boolean> {
    await delay(300);
    const index = mockSuppliers.findIndex(s => s.id === id);
    if (index === -1) return false;
    mockSuppliers.splice(index, 1);
    return true;
  },

  // Purchase Orders
  async getPurchaseOrders(filters?: PurchaseOrderFilters): Promise<{ data: PurchaseOrder[]; total: number }> {
    await delay(300);
    let result = [...mockPurchaseOrders];
    
    if (filters?.storeId) result = result.filter(p => p.storeId === filters.storeId);
    if (filters?.supplierId) result = result.filter(p => p.supplierId === filters.supplierId);
    if (filters?.status) result = result.filter(p => p.status === filters.status);
    if (filters?.paymentStatus) result = result.filter(p => p.paymentStatus === filters.paymentStatus);
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(p => 
        p.orderNumber.toLowerCase().includes(search) ||
        p.supplierName.toLowerCase().includes(search)
      );
    }
    
    return { data: result, total: result.length };
  },

  async getPurchaseOrder(id: string): Promise<PurchaseOrder | null> {
    await delay(200);
    return mockPurchaseOrders.find(p => p.id === id) || null;
  },

  async createPurchaseOrder(data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    await delay(400);
    const supplier = mockSuppliers.find(s => s.id === data.supplierId);
    const items = data.items.map((item, i) => ({
      ...item,
      id: `poi-${Date.now()}-${i}`,
      total: item.quantity * item.unitPrice,
    }));
    
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const tax = data.tax || subtotal * 0.075;
    const shipping = data.shipping || 0;
    
    const newPO: PurchaseOrder = {
      ...data,
      id: `po-${Date.now()}`,
      supplierName: supplier?.name || "Unknown",
      orderNumber: `PO-${new Date().getFullYear()}-${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`,
      items,
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
      status: "draft",
      orderDate: new Date().toISOString().split('T')[0],
      paymentStatus: "unpaid",
      paidAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPurchaseOrders.push(newPO);
    return newPO;
  },

  async updatePurchaseOrder(id: string, data: UpdatePurchaseOrderRequest): Promise<PurchaseOrder | null> {
    await delay(300);
    const index = mockPurchaseOrders.findIndex(p => p.id === id);
    if (index === -1) return null;
    mockPurchaseOrders[index] = { ...mockPurchaseOrders[index], ...data, updatedAt: new Date().toISOString() };
    return mockPurchaseOrders[index];
  },

  async deletePurchaseOrder(id: string): Promise<boolean> {
    await delay(300);
    const index = mockPurchaseOrders.findIndex(p => p.id === id);
    if (index === -1) return false;
    mockPurchaseOrders.splice(index, 1);
    return true;
  },

  // Stats
  async getStats(storeId?: string): Promise<SupplierStats> {
    await delay(200);
    const suppliers = storeId ? mockSuppliers.filter(s => s.storeId === storeId) : mockSuppliers;
    const orders = storeId ? mockPurchaseOrders.filter(p => p.storeId === storeId) : mockPurchaseOrders;
    
    return {
      totalSuppliers: suppliers.length,
      activeSuppliers: suppliers.filter(s => s.status === 'active').length,
      totalPurchaseOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
      totalSpent: suppliers.reduce((sum, s) => sum + s.totalSpent, 0),
      unpaidAmount: orders.filter(o => o.paymentStatus !== 'paid').reduce((sum, o) => sum + (o.total - o.paidAmount), 0),
    };
  },
};
