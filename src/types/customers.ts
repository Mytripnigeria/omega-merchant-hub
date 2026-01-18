// Customer Domain Types

export type CustomerStatus = "Active" | "VIP" | "Inactive";
export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export interface CustomerOrder {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: string;
  gender?: string;
  country: string;
  state: string;
  city: string;
  street?: string;
  zipCode?: string;
  orders: number;
  spent: number;
  lastOrder?: string;
  status: CustomerStatus;
  source: string;
  walletBalance: number;
  points: number;
  loyaltyTier: LoyaltyTier;
  groups: string[];
  referralCode: string;
  referredBy?: string;
  recentOrders: CustomerOrder[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  isActive: boolean;
}

export interface LoyaltyRule {
  id: string;
  tier: LoyaltyTier;
  pointsPerNaira: number;
  minSpendForTier: number;
  benefits: string[];
}

// API Request/Response Types
export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  groups?: string[];
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  status?: CustomerStatus;
  groups?: string[];
}

export interface CustomerFilters {
  status?: CustomerStatus;
  loyaltyTier?: LoyaltyTier;
  source?: string;
  group?: string;
  search?: string;
  minSpent?: number;
  maxSpent?: number;
}

export interface CustomerStats {
  total: number;
  active: number;
  vip: number;
  newThisMonth: number;
  totalWalletBalance: number;
  totalPoints: number;
}

export interface WalletTransaction {
  id: string;
  customerId: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  description: string;
  reference?: string;
  createdAt: string;
}

export interface PointsTransaction {
  id: string;
  customerId: string;
  type: "earned" | "redeemed" | "expired" | "adjusted";
  points: number;
  balance: number;
  description: string;
  orderId?: string;
  createdAt: string;
}
