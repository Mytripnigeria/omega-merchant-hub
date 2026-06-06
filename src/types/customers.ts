// Customer Domain Types — aligned with backend CustomerEntity / CustomerResponseDto

export type CustomerStatus = "active" | "vip" | "inactive";
export type CustomerSource = "walk-in" | "storefront" | "referral" | "import" | "other";
export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export interface Customer {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  gender: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  street: string | null;
  zipCode: string | null;
  status: CustomerStatus;
  source: CustomerSource;
  walletBalance: number;
  points: number;
  /** @deprecated Legacy fixed-threshold tier. Prefer `loyaltyTierName` which
   *  follows the merchant's configured tiers (Loyalty Offers). */
  loyaltyTier: LoyaltyTier;
  /** Merchant-configured tier id, or null when no tier matches. */
  loyaltyTierId: string | null;
  /** Resolved tier name (e.g. "Silver"), or null when no tier matches. */
  loyaltyTierName: string | null;
  groups: string[];
  referralCode: string;
  referredBy: string | null;
  notes: string | null;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string | null;
  hasUserAccount: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Request types

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  zipCode?: string;
  source?: CustomerSource;
  groups?: string[];
  notes?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  status?: CustomerStatus;
  loyaltyTier?: LoyaltyTier;
}

export interface CustomerFilters {
  status?: CustomerStatus;
  source?: CustomerSource;
  loyaltyTier?: LoyaltyTier;
  group?: string;
  search?: string;
  page?: number;
  limit?: number;
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
  reference: string | null;
  createdAt: string;
}

export interface PointsTransaction {
  id: string;
  customerId: string;
  type: "earned" | "redeemed" | "expired" | "adjusted";
  points: number;
  balance: number;
  description: string;
  orderId: string | null;
  createdAt: string;
}
