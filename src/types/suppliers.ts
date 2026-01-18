// Suppliers Types

export interface Supplier {
  id: string;
  storeId: string;
  name: string;
  contactName?: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  category?: "food" | "beverages" | "equipment" | "packaging" | "cleaning" | "other";
  paymentTerms?: "cod" | "net-7" | "net-15" | "net-30" | "net-60";
  bankName?: string;
  bankAccount?: string;
  taxId?: string;
  rating?: number;
  status: "active" | "inactive" | "blacklisted";
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  storeId: string;
  supplierId: string;
  supplierName: string;
  orderNumber: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "draft" | "pending" | "confirmed" | "shipped" | "received" | "cancelled";
  orderDate: string;
  expectedDelivery?: string;
  actualDelivery?: string;
  deliveryLocationId?: string;
  deliveryLocationName?: string;
  paymentStatus: "unpaid" | "partial" | "paid";
  paidAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  inventoryId?: string;
  name: string;
  sku?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  receivedQuantity?: number;
}

// Filters
export interface SupplierFilters {
  storeId?: string;
  category?: Supplier["category"];
  status?: Supplier["status"];
  search?: string;
  page?: number;
  limit?: number;
}

export interface PurchaseOrderFilters {
  storeId?: string;
  supplierId?: string;
  status?: PurchaseOrder["status"];
  paymentStatus?: PurchaseOrder["paymentStatus"];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Request types
export interface CreateSupplierRequest {
  storeId: string;
  name: string;
  contactName?: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  category?: Supplier["category"];
  paymentTerms?: Supplier["paymentTerms"];
  bankName?: string;
  bankAccount?: string;
  taxId?: string;
  notes?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  category?: Supplier["category"];
  paymentTerms?: Supplier["paymentTerms"];
  bankName?: string;
  bankAccount?: string;
  taxId?: string;
  rating?: number;
  status?: Supplier["status"];
  notes?: string;
}

export interface CreatePurchaseOrderRequest {
  storeId: string;
  supplierId: string;
  items: Omit<PurchaseOrderItem, 'id' | 'total' | 'receivedQuantity'>[];
  tax?: number;
  shipping?: number;
  expectedDelivery?: string;
  deliveryLocationId?: string;
  notes?: string;
}

export interface UpdatePurchaseOrderRequest {
  items?: PurchaseOrderItem[];
  tax?: number;
  shipping?: number;
  status?: PurchaseOrder["status"];
  expectedDelivery?: string;
  actualDelivery?: string;
  deliveryLocationId?: string;
  paymentStatus?: PurchaseOrder["paymentStatus"];
  paidAmount?: number;
  notes?: string;
}

// Stats
export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalPurchaseOrders: number;
  pendingOrders: number;
  totalSpent: number;
  unpaidAmount: number;
}
