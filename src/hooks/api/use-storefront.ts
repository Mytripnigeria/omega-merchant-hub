import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storefrontService } from '@/services/mock/storefront';
import type { 
  FeatureBannerFilters, 
  CreateFeatureBannerRequest, 
  UpdateFeatureBannerRequest 
} from '@/types/storefront';

// Query Keys
export const featureBannerKeys = {
  all: ['feature-banners'] as const,
  lists: () => [...featureBannerKeys.all, 'list'] as const,
  list: (filters?: FeatureBannerFilters) => [...featureBannerKeys.lists(), filters] as const,
  details: () => [...featureBannerKeys.all, 'detail'] as const,
  detail: (id: string) => [...featureBannerKeys.details(), id] as const,
};

// Hooks
export function useFeatureBanners(filters?: FeatureBannerFilters) {
  return useQuery({
    queryKey: featureBannerKeys.list(filters),
    queryFn: () => storefrontService.getFeatureBanners(filters),
  });
}

export function useFeatureBanner(id: string) {
  return useQuery({
    queryKey: featureBannerKeys.detail(id),
    queryFn: () => storefrontService.getFeatureBanner(id),
    enabled: !!id,
  });
}

export function useCreateFeatureBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFeatureBannerRequest) => storefrontService.createFeatureBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureBannerKeys.lists() });
    },
  });
}

export function useUpdateFeatureBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeatureBannerRequest }) => 
      storefrontService.updateFeatureBanner(id, data),
    onSuccess: (updatedBanner) => {
      queryClient.invalidateQueries({ queryKey: featureBannerKeys.lists() });
      if (updatedBanner) {
        queryClient.setQueryData(featureBannerKeys.detail(updatedBanner.id), updatedBanner);
      }
    },
  });
}

export function useDeleteFeatureBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => storefrontService.deleteFeatureBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureBannerKeys.lists() });
    },
  });
}

export function useReorderFeatureBanners() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderedIds: string[]) => storefrontService.reorderFeatureBanners(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureBannerKeys.lists() });
    },
  });
}
