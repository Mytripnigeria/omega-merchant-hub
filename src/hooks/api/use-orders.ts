// Orders API hooks — wired to the real backend orders module.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService, type OrderFilters } from "@/services/api/orders";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: (storeId?: string) => [...orderKeys.all, "stats", storeId] as const,
};

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => ordersService.list(filters),
    staleTime: 10 * 1000,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersService.findOne(id),
    enabled: !!id,
  });
}

export function useOrderStats(storeId?: string) {
  return useQuery({
    queryKey: orderKeys.stats(storeId),
    queryFn: () => ordersService.stats(storeId),
    staleTime: 30 * 1000,
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      ordersService.cancel(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
