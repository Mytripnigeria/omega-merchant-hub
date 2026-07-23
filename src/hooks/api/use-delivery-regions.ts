import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deliveryRegionsApi } from '@/services/api/delivery-regions';
import type {
  CreateDeliveryRegionRequest,
  DeliveryRegionFilters,
  UpdateDeliveryRegionRequest,
} from '@/types/delivery-regions';

export const deliveryRegionKeys = {
  all: ['delivery-regions'] as const,
  lists: () => [...deliveryRegionKeys.all, 'list'] as const,
  list: (filters?: DeliveryRegionFilters) =>
    [...deliveryRegionKeys.lists(), filters] as const,
  detail: (id: string) => [...deliveryRegionKeys.all, 'detail', id] as const,
};

export function useDeliveryRegions(filters?: DeliveryRegionFilters) {
  return useQuery({
    queryKey: deliveryRegionKeys.list(filters),
    queryFn: () => deliveryRegionsApi.list(filters),
  });
}

export function useDeliveryRegion(id: string | undefined) {
  return useQuery({
    queryKey: deliveryRegionKeys.detail(id ?? ''),
    queryFn: () => deliveryRegionsApi.get(id as string),
    enabled: !!id,
  });
}

export function useCreateDeliveryRegion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeliveryRegionRequest) => deliveryRegionsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryRegionKeys.all }),
  });
}

export function useUpdateDeliveryRegion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeliveryRegionRequest }) =>
      deliveryRegionsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryRegionKeys.all }),
  });
}

export function useDeleteDeliveryRegion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deliveryRegionsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryRegionKeys.all }),
  });
}
