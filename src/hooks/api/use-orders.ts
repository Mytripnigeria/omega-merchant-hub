// Orders API hooks — wired to the real backend orders module.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ordersService,
  type OrderFilters,
  type OrderStatus,
} from "@/services/api/orders";
import { transactionKeys } from "./use-transactions";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  events: (id: string) => [...orderKeys.all, "events", id] as const,
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

export function useOrderEvents(id: string) {
  return useQuery({
    queryKey: orderKeys.events(id),
    queryFn: () => ordersService.events(id),
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

export function useRefundOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      amount,
      reason,
    }: {
      id: string;
      amount: number;
      reason?: string;
    }) => ordersService.refund(id, { amount, reason }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      qc.invalidateQueries({ queryKey: orderKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: orderKeys.events(vars.id) });
      qc.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useRecordOrderPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      amount,
      paymentMethodId,
    }: {
      id: string;
      amount?: number;
      paymentMethodId?: string;
    }) => ordersService.recordPayment(id, { amount, paymentMethodId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: orderKeys.events(vars.id) });
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(vars.id) });
      qc.invalidateQueries({ queryKey: orderKeys.events(vars.id) });
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
