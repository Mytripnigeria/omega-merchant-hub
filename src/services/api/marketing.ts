import { apiRequest } from "@/lib/api-client";
import type {
  CreateDiscountCodeRequest,
  CreateLoyaltyTierRequest,
  DiscountCode,
  DiscountCodeFilters,
  LoyaltySettings,
  LoyaltyStats,
  LoyaltyTier,
  LoyaltyTierFilters,
  Referral,
  ReferralFilters,
  ReferralSettings,
  ReferralStats,
  UpdateDiscountCodeRequest,
  UpdateLoyaltySettingsRequest,
  UpdateLoyaltyTierRequest,
  UpdateReferralSettingsRequest,
} from "@/types/marketing";

interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildQuery(filters: Record<string, unknown> = {}): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  return qs.toString() ? `?${qs.toString()}` : "";
}

// ─── Discount codes (coupons) ───────────────────────────────────────

export const discountCodesApi = {
  list: (filters: DiscountCodeFilters = {}) =>
    apiRequest<Paginated<DiscountCode>>(`/coupons${buildQuery(filters)}`),
  get: (id: string) => apiRequest<DiscountCode>(`/coupons/${id}`),
  create: (data: CreateDiscountCodeRequest) =>
    apiRequest<DiscountCode>(`/coupons`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateDiscountCodeRequest) =>
    apiRequest<DiscountCode>(`/coupons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    apiRequest<void>(`/coupons/${id}`, { method: "DELETE" }),
};

// ─── Loyalty tiers + settings ──────────────────────────────────────

export const loyaltyApi = {
  listTiers: (filters: LoyaltyTierFilters = {}) =>
    apiRequest<Paginated<LoyaltyTier>>(`/loyalty/tiers${buildQuery(filters)}`),
  getTier: (id: string) => apiRequest<LoyaltyTier>(`/loyalty/tiers/${id}`),
  createTier: (data: CreateLoyaltyTierRequest) =>
    apiRequest<LoyaltyTier>(`/loyalty/tiers`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTier: (id: string, data: UpdateLoyaltyTierRequest) =>
    apiRequest<LoyaltyTier>(`/loyalty/tiers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  removeTier: (id: string) =>
    apiRequest<void>(`/loyalty/tiers/${id}`, { method: "DELETE" }),

  getSettings: () => apiRequest<LoyaltySettings>(`/loyalty/settings`),
  updateSettings: (data: UpdateLoyaltySettingsRequest) =>
    apiRequest<LoyaltySettings>(`/loyalty/settings`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getStats: () => apiRequest<LoyaltyStats>(`/loyalty/stats`),
};

// ─── Referrals + settings ──────────────────────────────────────────

export const referralsApi = {
  list: (filters: ReferralFilters = {}) =>
    apiRequest<Paginated<Referral>>(`/referrals${buildQuery(filters)}`),
  get: (id: string) => apiRequest<Referral>(`/referrals/${id}`),

  getStats: () => apiRequest<ReferralStats>(`/referrals/stats`),
  getSettings: () => apiRequest<ReferralSettings>(`/referrals/settings`),
  updateSettings: (data: UpdateReferralSettingsRequest) =>
    apiRequest<ReferralSettings>(`/referrals/settings`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
