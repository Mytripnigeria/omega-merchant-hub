// Marketing Types — aligned with backend coupons + loyalty + referrals modules.

// ─── Coupons (Discount Codes) ───────────────────────────────────────

export type CouponType = "percentage" | "fixed";
/** `automatic` applies the discount to the product price the moment the cart
 * shows up; `code` requires the customer to type the promo code at checkout. */
export type CouponMethod = "automatic" | "code";
export type CouponApplicableTo =
  | "all"
  | "specific_products"
  | "specific_categories";

export interface DiscountCode {
  id: string;
  businessId: string;
  code: string;
  description: string | null;
  type: CouponType;
  method: CouponMethod;
  value: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  perCustomerLimit: number | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  applicableTo: CouponApplicableTo;
  productIds: string[];
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscountCodeFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateDiscountCodeRequest {
  code: string;
  description?: string;
  type: CouponType;
  method?: CouponMethod;
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perCustomerLimit?: number;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
  applicableTo?: CouponApplicableTo;
  productIds?: string[];
  categoryIds?: string[];
}

export type UpdateDiscountCodeRequest = Partial<CreateDiscountCodeRequest>;

// ─── Loyalty ────────────────────────────────────────────────────────

export type LoyaltyBenefitType =
  | "discount"
  | "free_shipping"
  | "free_item"
  | "points_multiplier"
  | "exclusive_access";

export interface LoyaltyBenefit {
  id: string;
  type: LoyaltyBenefitType;
  value: number;
  description: string;
}

export interface LoyaltyTier {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  minPoints: number;
  color: string | null;
  benefits: LoyaltyBenefit[];
  isActive: boolean;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyTierFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateLoyaltyTierRequest {
  name: string;
  description?: string;
  minPoints: number;
  color?: string;
  benefits?: LoyaltyBenefit[];
  isActive?: boolean;
}

export type UpdateLoyaltyTierRequest = Partial<CreateLoyaltyTierRequest>;

export interface LoyaltySettings {
  id: string;
  businessId: string;
  pointsPerNaira: number;
  nairaPerPoint: number;
  minPointsToRedeem: number;
  pointsExpiryDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLoyaltySettingsRequest {
  pointsPerNaira?: number;
  nairaPerPoint?: number;
  minPointsToRedeem?: number;
  pointsExpiryDays?: number;
  isActive?: boolean;
}

export interface LoyaltyStats {
  totalMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalPointsBalance: number;
  rewardsRedeemed: number;
}

// ─── Referrals ──────────────────────────────────────────────────────

export type ReferralStatus =
  | "pending"
  | "signed_up"
  | "first_purchase"
  | "rewarded"
  | "expired";

export type ReferralRewardType = "wallet_credit" | "points";

export interface Referral {
  id: string;
  businessId: string;
  referrerCustomerId: string;
  referredCustomerId: string;
  referralCode: string;
  status: ReferralStatus;
  referrerReward: number;
  referredReward: number;
  rewardType: ReferralRewardType;
  firstOrderId: string | null;
  signedUpAt: string | null;
  firstPurchaseAt: string | null;
  rewardedAt: string | null;
  expiresAt: string | null;
  referrerName: string | null;
  referredName: string | null;
  referredEmail: string | null;
  referredPhone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralFilters {
  search?: string;
  status?: ReferralStatus;
  referrerCustomerId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ReferralSettings {
  id: string;
  businessId: string;
  referrerReward: number;
  referredReward: number;
  rewardType: ReferralRewardType;
  expiryDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReferralSettingsRequest {
  referrerReward?: number;
  referredReward?: number;
  rewardType?: ReferralRewardType;
  expiryDays?: number;
  isActive?: boolean;
}

export interface ReferralStats {
  totalReferrals: number;
  pending: number;
  signedUp: number;
  rewarded: number;
  expired: number;
  totalRewardsPaid: number;
  totalPendingRewards: number;
}
