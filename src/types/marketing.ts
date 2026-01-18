// Marketing Types

export interface DiscountCode {
  id: string;
  storeId: string;
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed" | "free-shipping" | "buy-x-get-y";
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applicableTo: "all" | "specific-products" | "specific-categories";
  productIds?: string[];
  categoryIds?: string[];
  usageLimit?: number;
  usageCount: number;
  usageLimitPerCustomer?: number;
  validFrom: string;
  validTo: string;
  status: "active" | "inactive" | "expired" | "exhausted";
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyTier {
  id: string;
  storeId: string;
  name: string;
  description?: string;
  minPoints: number;
  maxPoints?: number;
  color?: string;
  benefits: LoyaltyBenefit[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyBenefit {
  id: string;
  type: "discount" | "free-item" | "points-multiplier" | "free-shipping" | "exclusive-access";
  value: number;
  description: string;
}

export interface LoyaltySettings {
  id: string;
  storeId: string;
  pointsPerNaira: number;
  nairaPerPoint: number;
  welcomePoints: number;
  birthdayPoints: number;
  referralPoints: number;
  expiryDays?: number;
  isActive: boolean;
}

export interface Referral {
  id: string;
  storeId: string;
  referrerId: string;
  referrerName: string;
  referredId?: string;
  referredName?: string;
  referredEmail: string;
  referredPhone?: string;
  referralCode: string;
  status: "pending" | "signed-up" | "first-purchase" | "rewarded" | "expired";
  referrerReward?: number;
  referredReward?: number;
  rewardType: "points" | "credit" | "discount";
  expiresAt?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Filters
export interface DiscountCodeFilters {
  storeId?: string;
  status?: DiscountCode["status"];
  type?: DiscountCode["type"];
  search?: string;
  page?: number;
  limit?: number;
}

export interface LoyaltyTierFilters {
  storeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReferralFilters {
  storeId?: string;
  referrerId?: string;
  status?: Referral["status"];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Request types
export interface CreateDiscountCodeRequest {
  storeId: string;
  code: string;
  name: string;
  description?: string;
  type: DiscountCode["type"];
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applicableTo: DiscountCode["applicableTo"];
  productIds?: string[];
  categoryIds?: string[];
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  validFrom: string;
  validTo: string;
}

export interface UpdateDiscountCodeRequest {
  code?: string;
  name?: string;
  description?: string;
  type?: DiscountCode["type"];
  value?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applicableTo?: DiscountCode["applicableTo"];
  productIds?: string[];
  categoryIds?: string[];
  usageLimit?: number;
  usageLimitPerCustomer?: number;
  validFrom?: string;
  validTo?: string;
  status?: DiscountCode["status"];
}

export interface CreateLoyaltyTierRequest {
  storeId: string;
  name: string;
  description?: string;
  minPoints: number;
  maxPoints?: number;
  color?: string;
  benefits: Omit<LoyaltyBenefit, 'id'>[];
}

export interface UpdateLoyaltyTierRequest {
  name?: string;
  description?: string;
  minPoints?: number;
  maxPoints?: number;
  color?: string;
  benefits?: LoyaltyBenefit[];
}

export interface UpdateLoyaltySettingsRequest {
  pointsPerNaira?: number;
  nairaPerPoint?: number;
  welcomePoints?: number;
  birthdayPoints?: number;
  referralPoints?: number;
  expiryDays?: number;
  isActive?: boolean;
}

export interface CreateReferralRequest {
  storeId: string;
  referrerId: string;
  referredEmail: string;
  referredPhone?: string;
  rewardType: Referral["rewardType"];
  referrerReward?: number;
  referredReward?: number;
}

export interface UpdateReferralRequest {
  referredId?: string;
  referredName?: string;
  status?: Referral["status"];
  convertedAt?: string;
}

// Stats
export interface MarketingStats {
  activeDiscounts: number;
  totalDiscountUsage: number;
  totalDiscountValue: number;
  loyaltyMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
  totalReferrals: number;
  successfulReferrals: number;
  referralConversionRate: number;
}
