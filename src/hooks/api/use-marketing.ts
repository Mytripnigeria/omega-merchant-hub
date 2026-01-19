// Marketing API Hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { marketingService } from "@/services/mock/marketing";
import type {
  DiscountCode,
  LoyaltyTier,
  LoyaltySettings,
  Referral,
  DiscountCodeFilters,
  LoyaltyTierFilters,
  ReferralFilters,
  CreateDiscountCodeRequest,
  UpdateDiscountCodeRequest,
  CreateLoyaltyTierRequest,
  UpdateLoyaltyTierRequest,
  UpdateLoyaltySettingsRequest,
  CreateReferralRequest,
  UpdateReferralRequest,
} from "@/types/marketing";

// ============= Discount Codes =============

export const discountCodeKeys = {
  all: ["discountCodes"] as const,
  lists: () => [...discountCodeKeys.all, "list"] as const,
  list: (filters?: DiscountCodeFilters) => [...discountCodeKeys.lists(), filters] as const,
  details: () => [...discountCodeKeys.all, "detail"] as const,
  detail: (id: string) => [...discountCodeKeys.details(), id] as const,
};

export function useDiscountCodes(filters?: DiscountCodeFilters) {
  return useQuery({
    queryKey: discountCodeKeys.list(filters),
    queryFn: () => marketingService.getDiscountCodes(filters),
  });
}

export function useDiscountCode(id: string) {
  return useQuery({
    queryKey: discountCodeKeys.detail(id),
    queryFn: () => marketingService.getDiscountCode(id),
    enabled: !!id,
  });
}

export function useCreateDiscountCode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDiscountCodeRequest) => marketingService.createDiscountCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountCodeKeys.lists() });
    },
  });
}

export function useUpdateDiscountCode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDiscountCodeRequest }) =>
      marketingService.updateDiscountCode(id, data),
    onSuccess: (updatedCode) => {
      if (updatedCode) {
        queryClient.setQueryData(discountCodeKeys.detail(updatedCode.id), updatedCode);
      }
      queryClient.invalidateQueries({ queryKey: discountCodeKeys.lists() });
    },
  });
}

export function useDeleteDiscountCode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => marketingService.deleteDiscountCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: discountCodeKeys.lists() });
    },
  });
}

// ============= Loyalty Tiers =============

export const loyaltyTierKeys = {
  all: ["loyaltyTiers"] as const,
  lists: () => [...loyaltyTierKeys.all, "list"] as const,
  list: (filters?: LoyaltyTierFilters) => [...loyaltyTierKeys.lists(), filters] as const,
  details: () => [...loyaltyTierKeys.all, "detail"] as const,
  detail: (id: string) => [...loyaltyTierKeys.details(), id] as const,
};

export function useLoyaltyTiers(filters?: LoyaltyTierFilters) {
  return useQuery({
    queryKey: loyaltyTierKeys.list(filters),
    queryFn: () => marketingService.getLoyaltyTiers(filters),
  });
}

export function useLoyaltyTier(id: string) {
  return useQuery({
    queryKey: loyaltyTierKeys.detail(id),
    queryFn: () => marketingService.getLoyaltyTier(id),
    enabled: !!id,
  });
}

export function useCreateLoyaltyTier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateLoyaltyTierRequest) => marketingService.createLoyaltyTier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loyaltyTierKeys.lists() });
    },
  });
}

export function useUpdateLoyaltyTier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLoyaltyTierRequest }) =>
      marketingService.updateLoyaltyTier(id, data),
    onSuccess: (updatedTier) => {
      if (updatedTier) {
        queryClient.setQueryData(loyaltyTierKeys.detail(updatedTier.id), updatedTier);
      }
      queryClient.invalidateQueries({ queryKey: loyaltyTierKeys.lists() });
    },
  });
}

export function useDeleteLoyaltyTier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => marketingService.deleteLoyaltyTier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loyaltyTierKeys.lists() });
    },
  });
}

// ============= Loyalty Settings =============

export const loyaltySettingsKeys = {
  all: ["loyaltySettings"] as const,
  detail: (storeId: string) => [...loyaltySettingsKeys.all, storeId] as const,
};

export function useLoyaltySettings(storeId: string) {
  return useQuery({
    queryKey: loyaltySettingsKeys.detail(storeId),
    queryFn: () => marketingService.getLoyaltySettings(storeId),
    enabled: !!storeId,
  });
}

export function useUpdateLoyaltySettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ storeId, data }: { storeId: string; data: UpdateLoyaltySettingsRequest }) =>
      marketingService.updateLoyaltySettings(storeId, data),
    onSuccess: (_, { storeId }) => {
      queryClient.invalidateQueries({ queryKey: loyaltySettingsKeys.detail(storeId) });
    },
  });
}

// ============= Referrals =============

export const referralKeys = {
  all: ["referrals"] as const,
  lists: () => [...referralKeys.all, "list"] as const,
  list: (filters?: ReferralFilters) => [...referralKeys.lists(), filters] as const,
  details: () => [...referralKeys.all, "detail"] as const,
  detail: (id: string) => [...referralKeys.details(), id] as const,
};

export function useReferrals(filters?: ReferralFilters) {
  return useQuery({
    queryKey: referralKeys.list(filters),
    queryFn: () => marketingService.getReferrals(filters),
  });
}

export function useReferral(id: string) {
  return useQuery({
    queryKey: referralKeys.detail(id),
    queryFn: () => marketingService.getReferral(id),
    enabled: !!id,
  });
}

export function useCreateReferral() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReferralRequest) => marketingService.createReferral(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: referralKeys.lists() });
    },
  });
}

export function useUpdateReferral() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReferralRequest }) =>
      marketingService.updateReferral(id, data),
    onSuccess: (updatedReferral) => {
      if (updatedReferral) {
        queryClient.setQueryData(referralKeys.detail(updatedReferral.id), updatedReferral);
      }
      queryClient.invalidateQueries({ queryKey: referralKeys.lists() });
    },
  });
}

// ============= Marketing Stats =============

export const marketingStatsKeys = {
  all: ["marketingStats"] as const,
  detail: (storeId?: string) => [...marketingStatsKeys.all, storeId] as const,
};

export function useMarketingStats(storeId?: string) {
  return useQuery({
    queryKey: marketingStatsKeys.detail(storeId),
    queryFn: () => marketingService.getStats(storeId),
  });
}
