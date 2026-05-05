import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deliveriesService, type DeliveryFilters } from "@/services/api/deliveries";

export const deliveriesKeys = {
  all: ["deliveries"] as const,
  list: (filters?: DeliveryFilters) => [...deliveriesKeys.all, "list", filters] as const,
};

export function useDeliveries(filters: DeliveryFilters = {}) {
  return useQuery({
    queryKey: deliveriesKeys.list(filters),
    queryFn: () => deliveriesService.list(filters),
    staleTime: 10 * 1000,
  });
}

export function useAssignDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, riderStaffId }: { id: string; riderStaffId: string }) =>
      deliveriesService.assign(id, riderStaffId),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveriesKeys.all }),
  });
}

export function useFailDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      deliveriesService.fail(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveriesKeys.all }),
  });
}
