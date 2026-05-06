import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  discountCodesApi,
  loyaltyApi,
  referralsApi,
} from "@/services/api/marketing";
import type {
  CreateDiscountCodeRequest,
  CreateLoyaltyTierRequest,
  DiscountCodeFilters,
  LoyaltyTierFilters,
  ReferralFilters,
  UpdateDiscountCodeRequest,
  UpdateLoyaltySettingsRequest,
  UpdateLoyaltyTierRequest,
  UpdateReferralSettingsRequest,
} from "@/types/marketing";

// ─── Discount codes ─────────────────────────────────────────────────

export const discountCodeKeys = {
  all: ["discountCodes"] as const,
  lists: () => [...discountCodeKeys.all, "list"] as const,
  list: (filters?: DiscountCodeFilters) =>
    [...discountCodeKeys.lists(), filters] as const,
  details: () => [...discountCodeKeys.all, "detail"] as const,
  detail: (id: string) => [...discountCodeKeys.details(), id] as const,
};

export function useDiscountCodes(filters?: DiscountCodeFilters) {
  return useQuery({
    queryKey: discountCodeKeys.list(filters),
    queryFn: () => discountCodesApi.list(filters),
    staleTime: 10 * 1000,
  });
}

export function useDiscountCode(id: string) {
  return useQuery({
    queryKey: discountCodeKeys.detail(id),
    queryFn: () => discountCodesApi.get(id),
    enabled: !!id,
  });
}

export function useCreateDiscountCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDiscountCodeRequest) =>
      discountCodesApi.create(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: discountCodeKeys.all }),
  });
}

export function useUpdateDiscountCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateDiscountCodeRequest;
    }) => discountCodesApi.update(id, data),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: discountCodeKeys.lists() });
      qc.invalidateQueries({ queryKey: discountCodeKeys.detail(vars.id) });
    },
  });
}

export function useDeleteDiscountCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => discountCodesApi.remove(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: discountCodeKeys.all }),
  });
}

// ─── Loyalty ────────────────────────────────────────────────────────

export const loyaltyTierKeys = {
  all: ["loyaltyTiers"] as const,
  lists: () => [...loyaltyTierKeys.all, "list"] as const,
  list: (filters?: LoyaltyTierFilters) =>
    [...loyaltyTierKeys.lists(), filters] as const,
  details: () => [...loyaltyTierKeys.all, "detail"] as const,
  detail: (id: string) => [...loyaltyTierKeys.details(), id] as const,
  settings: () => ["loyaltySettings"] as const,
  stats: () => ["loyaltyStats"] as const,
};

export function useLoyaltyTiers(filters?: LoyaltyTierFilters) {
  return useQuery({
    queryKey: loyaltyTierKeys.list(filters),
    queryFn: () => loyaltyApi.listTiers(filters),
    staleTime: 10 * 1000,
  });
}

export function useLoyaltyTier(id: string) {
  return useQuery({
    queryKey: loyaltyTierKeys.detail(id),
    queryFn: () => loyaltyApi.getTier(id),
    enabled: !!id,
  });
}

export function useCreateLoyaltyTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLoyaltyTierRequest) => loyaltyApi.createTier(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: loyaltyTierKeys.all }),
  });
}

export function useUpdateLoyaltyTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateLoyaltyTierRequest;
    }) => loyaltyApi.updateTier(id, data),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: loyaltyTierKeys.lists() });
      qc.invalidateQueries({ queryKey: loyaltyTierKeys.detail(vars.id) });
    },
  });
}

export function useDeleteLoyaltyTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => loyaltyApi.removeTier(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: loyaltyTierKeys.all }),
  });
}

export function useLoyaltySettings() {
  return useQuery({
    queryKey: loyaltyTierKeys.settings(),
    queryFn: () => loyaltyApi.getSettings(),
  });
}

export function useUpdateLoyaltySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateLoyaltySettingsRequest) =>
      loyaltyApi.updateSettings(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: loyaltyTierKeys.settings() }),
  });
}

export function useLoyaltyStats() {
  return useQuery({
    queryKey: loyaltyTierKeys.stats(),
    queryFn: () => loyaltyApi.getStats(),
    staleTime: 30 * 1000,
  });
}

// ─── Referrals ──────────────────────────────────────────────────────

export const referralKeys = {
  all: ["referrals"] as const,
  lists: () => [...referralKeys.all, "list"] as const,
  list: (filters?: ReferralFilters) =>
    [...referralKeys.lists(), filters] as const,
  details: () => [...referralKeys.all, "detail"] as const,
  detail: (id: string) => [...referralKeys.details(), id] as const,
  settings: () => ["referralSettings"] as const,
  stats: () => ["referralStats"] as const,
};

export function useReferrals(filters?: ReferralFilters) {
  return useQuery({
    queryKey: referralKeys.list(filters),
    queryFn: () => referralsApi.list(filters),
    staleTime: 10 * 1000,
  });
}

export function useReferral(id: string) {
  return useQuery({
    queryKey: referralKeys.detail(id),
    queryFn: () => referralsApi.get(id),
    enabled: !!id,
  });
}

export function useReferralStats() {
  return useQuery({
    queryKey: referralKeys.stats(),
    queryFn: () => referralsApi.getStats(),
    staleTime: 30 * 1000,
  });
}

export function useReferralSettings() {
  return useQuery({
    queryKey: referralKeys.settings(),
    queryFn: () => referralsApi.getSettings(),
  });
}

export function useUpdateReferralSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateReferralSettingsRequest) =>
      referralsApi.updateSettings(data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: referralKeys.settings() }),
  });
}
