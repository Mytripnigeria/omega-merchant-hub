// Store Types
export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

// Product Types
export interface Category {
  id: string;
  name: string;
  emoji?: string;
  description?: string;
  productCount: number;
  isActive: boolean;
}

export interface Variation {
  id: string;
  name: string;
  options: VariationOption[];
}

export interface VariationOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface AddOnGroup {
  id: string;
  name: string;
  addOns: AddOn[];
  minSelection: number;
  maxSelection: number;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  supplierId?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  isAvailable: boolean;
  prepTime: number; // in minutes
  variations?: Variation[];
  addOnGroups?: AddOnGroup[];
  ingredients?: { ingredientId: string; quantity: number }[];
  recommendations?: string[]; // product IDs
}

export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  products: { productId: string; quantity: number }[];
  image?: string;
  isActive: boolean;
}

// Order Types
export type OrderStatus = 'new' | 'ongoing' | 'ready' | 'transit' | 'completed' | 'hold' | 'cancelled';
export type OrderType = 'dine-in' | 'pickup' | 'delivery';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'partial';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variations?: { name: string; option: string; priceModifier: number }[];
  addOns?: { name: string; price: number }[];
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  storeId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
  status: OrderStatus;
  type: OrderType;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'card' | 'cash' | 'wallet' | 'points' | 'transfer';
  staffId: string;
  staffName: string;
  tableNumber?: string;
  deliveryAddress?: string;
  deliveryFee?: number;
  estimatedPrepTime: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  orderId?: string;
  type: 'sale' | 'refund' | 'payout' | 'expense' | 'adjustment';
  amount: number;
  method: 'card' | 'cash' | 'wallet' | 'points' | 'transfer';
  reference: string;
  staffId: string;
  staffName: string;
  storeId: string;
  createdAt: string;
  notes?: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  walletBalance: number;
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  orderCount: number;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  lastOrderAt?: string;
}

export interface LoyaltyRule {
  id: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  pointsPerNaira: number;
  minSpendForTier: number;
  benefits: string[];
}

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  applicableTo: 'all' | 'specific';
  productIds?: string[];
  categoryIds?: string[];
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeId: string;
  refereeName: string;
  bonusAmount: number;
  status: 'pending' | 'completed' | 'expired';
  createdAt: string;
  completedAt?: string;
}

// HR Types
export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  storeIds: string[];
  isActive: boolean;
  pin?: string;
  workstationAccess: boolean;
  performanceScore: number;
  kpiScore: number;
  hireDate: string;
  salary: number;
  avatar?: string;
}

export interface StaffRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  storeId: string;
  startTime: string;
  endTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'absent' | 'late';
  role: string;
  notes?: string;
}

export interface Payslip {
  id: string;
  staffId: string;
  staffName: string;
  period: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'paid';
  paidAt?: string;
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  target: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  assignedTo: 'staff' | 'store' | 'role';
  assignedIds: string[];
  isActive: boolean;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  items: string[];
  totalPurchases: number;
  outstandingBalance: number;
  rating: number;
  isActive: boolean;
}

// Inventory Types
export interface InventoryLocation {
  id: string;
  name: string;
  type: 'instore' | 'outstore';
  storeId: string;
  description?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  type: 'ingredient' | 'packaging' | 'equipment' | 'addon';
  locationId: string;
  quantity: number;
  unit: string;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplierId?: string;
  linkedProductIds?: string[];
  expiryDate?: string;
}

export interface StockTransfer {
  id: string;
  fromLocationId: string;
  toLocationId: string;
  items: { itemId: string; quantity: number }[];
  status: 'pending' | 'completed' | 'cancelled';
  requestedBy: string;
  approvedBy?: string;
  createdAt: string;
  completedAt?: string;
}
